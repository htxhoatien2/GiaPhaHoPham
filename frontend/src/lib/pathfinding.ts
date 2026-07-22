/**
 * @project AncestorTree
 * @file src/lib/pathfinding.ts
 * @description Relationship pathfinding with Central Vietnam (Miền Trung / Quảng Nam - Đà Nẵng - Huế)
 *              kinship addressing terminology & branch seniority logic (Cành Bác - Cành Chú).
 * @version 2.0.0
 * @updated 2026-03-25
 */

import type { Person } from '@/types';
import type { TreeData } from './supabase-data';

export interface RegionalKinshipTerms {
  personACallsPersonB: string;
  personBCallsPersonA: string;
  branchSeniority: string;
  explanation: string;
}

export interface RelationshipResult {
  found: boolean;
  path: Person[];
  lca: Person | null;
  distance: number;
  description: string;
  descriptionDetail: string;
  regionalTerms?: RegionalKinshipTerms;
}

interface GraphEdge {
  to: string;
  type: 'parent' | 'child' | 'spouse';
}

// ─── Graph Construction ─────────────────────────────────────────────────────

function buildGraph(data: TreeData): Map<string, GraphEdge[]> {
  const graph = new Map<string, GraphEdge[]>();

  const addEdge = (from: string, to: string, type: GraphEdge['type']) => {
    if (!graph.has(from)) graph.set(from, []);
    graph.get(from)!.push({ to, type });
  };

  const { families, children } = data;

  const familyChildren = new Map<string, string[]>();
  for (const c of children) {
    const list = familyChildren.get(c.family_id) || [];
    list.push(c.person_id);
    familyChildren.set(c.family_id, list);
  }

  for (const family of families) {
    if (family.father_id && family.mother_id) {
      addEdge(family.father_id, family.mother_id, 'spouse');
      addEdge(family.mother_id, family.father_id, 'spouse');
    }

    const kids = familyChildren.get(family.id) || [];
    for (const childId of kids) {
      if (family.father_id) {
        addEdge(family.father_id, childId, 'child');
        addEdge(childId, family.father_id, 'parent');
      }
      if (family.mother_id) {
        addEdge(family.mother_id, childId, 'child');
        addEdge(childId, family.mother_id, 'parent');
      }
    }
  }

  return graph;
}

// ─── BFS Shortest Path ─────────────────────────────────────────────────────

function bfs(
  graph: Map<string, GraphEdge[]>,
  startId: string,
  endId: string,
  personMap: Map<string, Person>,
): Person[] | null {
  if (startId === endId) return null;

  const visited = new Set<string>();
  const parent = new Map<string, string>();
  const queue: string[] = [startId];
  visited.add(startId);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const edges = graph.get(current) || [];

    for (const edge of edges) {
      if (visited.has(edge.to)) continue;
      visited.add(edge.to);
      parent.set(edge.to, current);

      if (edge.to === endId) {
        const path: Person[] = [];
        let node: string | undefined = endId;
        while (node !== undefined) {
          const person = personMap.get(node);
          if (person) path.unshift(person);
          node = parent.get(node);
        }
        return path;
      }
      queue.push(edge.to);
    }
  }

  return null;
}

// ─── LCA & Parent Lookup ───────────────────────────────────────────────────

function buildParentMap(data: TreeData): Map<string, string[]> {
  const parentMap = new Map<string, string[]>();
  const { families, children } = data;

  const familyParents = new Map<string, string[]>();
  for (const f of families) {
    const parents: string[] = [];
    if (f.father_id) parents.push(f.father_id);
    if (f.mother_id) parents.push(f.mother_id);
    familyParents.set(f.id, parents);
  }

  for (const c of children) {
    const parents = familyParents.get(c.family_id) || [];
    const existing = parentMap.get(c.person_id) || [];
    parentMap.set(c.person_id, [...existing, ...parents]);
  }

  return parentMap;
}

function findLCA(
  parentMap: Map<string, string[]>,
  personMap: Map<string, Person>,
  personAId: string,
  personBId: string,
): Person | null {
  const ancestorsA = new Set<string>();
  const queueA: string[] = [personAId];
  while (queueA.length > 0) {
    const current = queueA.shift()!;
    if (ancestorsA.has(current)) continue;
    ancestorsA.add(current);
    const parents = parentMap.get(current) || [];
    for (const p of parents) queueA.push(p);
  }

  const visitedB = new Set<string>();
  const queueB: string[] = [personBId];
  while (queueB.length > 0) {
    const current = queueB.shift()!;
    if (visitedB.has(current)) continue;
    visitedB.add(current);

    if (ancestorsA.has(current) && current !== personAId && current !== personBId) {
      return personMap.get(current) || null;
    }

    const parents = parentMap.get(current) || [];
    for (const p of parents) queueB.push(p);
  }

  if (ancestorsA.has(personBId)) return personMap.get(personBId) || null;
  if (visitedB.has(personAId)) return personMap.get(personAId) || null;

  return null;
}

function getAncestorChain(parentMap: Map<string, string[]>, startId: string, targetId: string): string[] {
  const queue: string[][] = [[startId]];
  const visited = new Set<string>();
  visited.add(startId);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const last = path[path.length - 1];

    if (last === targetId) return path;

    const parents = parentMap.get(last) || [];
    for (const p of parents) {
      if (!visited.has(p)) {
        visited.add(p);
        queue.push([...path, p]);
      }
    }
  }

  return [];
}

// ─── Central Vietnam Kinship Naming Logic ────────────────────────────────────

function describeCentralRelationship(
  personA: Person,
  personB: Person,
  lca: Person | null,
  path: Person[],
  parentMap: Map<string, string[]>,
  personMap: Map<string, Person>
): { description: string; detail: string; regionalTerms?: RegionalKinshipTerms } {
  if (personA.id === personB.id) {
    return { description: 'Cùng một người', detail: '' };
  }

  const parentsOfB = parentMap.get(personB.id) || [];
  const parentsOfA = parentMap.get(personA.id) || [];

  // Direct Parent - Child
  if (parentsOfB.includes(personA.id)) {
    const roleA = personA.gender === 1 ? 'Cha (Ba)' : 'Mẹ (Mạ)';
    return {
      description: `${personA.display_name} là ${roleA} của ${personB.display_name}`,
      detail: `Quan hệ trực hệ Cha/Mẹ — Con`,
      regionalTerms: {
        personACallsPersonB: 'Con',
        personBCallsPersonA: roleA,
        branchSeniority: 'Trực hệ',
        explanation: 'Theo cách gọi Miền Trung: Cha/Ba - Mẹ/Mạ xưng hô với Con',
      },
    };
  }
  if (parentsOfA.includes(personB.id)) {
    const roleB = personB.gender === 1 ? 'Cha (Ba)' : 'Mẹ (Mạ)';
    return {
      description: `${personB.display_name} là ${roleB} của ${personA.display_name}`,
      detail: `Quan hệ trực hệ Cha/Mẹ — Con`,
      regionalTerms: {
        personACallsPersonB: roleB,
        personBCallsPersonA: 'Con',
        branchSeniority: 'Trực hệ',
        explanation: 'Theo cách gọi Miền Trung: Cha/Ba - Mẹ/Mạ xưng hô với Con',
      },
    };
  }

  // Spouse
  if (path.length === 2) {
    return {
      description: `${personA.display_name} và ${personB.display_name} là Vợ Chồng`,
      detail: 'Quan hệ hôn nhân trực tiếp',
      regionalTerms: {
        personACallsPersonB: personB.gender === 1 ? 'Chồng' : 'Vợ',
        personBCallsPersonA: personA.gender === 1 ? 'Chồng' : 'Vợ',
        branchSeniority: 'Phu Thê',
        explanation: 'Vợ chồng trong gia đình',
      },
    };
  }

  if (!lca) {
    return {
      description: 'Có quan hệ thông gia / liên kết dòng họ',
      detail: `Kết nối qua ${path.length - 1} bậc trong cây gia phả`,
    };
  }

  // Chain from A up to LCA, and B up to LCA
  const chainA = getAncestorChain(parentMap, personA.id, lca.id);
  const chainB = getAncestorChain(parentMap, personB.id, lca.id);

  const genA = chainA.length > 0 ? chainA.length - 1 : -1;
  const genB = chainB.length > 0 ? chainB.length - 1 : -1;

  if (genA === -1 || genB === -1) {
    return {
      description: 'Có quan hệ họ hàng',
      detail: `Tổ tiên chung: ${lca.display_name} (Đời thứ ${lca.generation})`,
    };
  }

  // 1. Direct Ancestor - Descendant (A is ancestor of B or vice versa)
  if (genA === 0) {
    // A is LCA (A is ancestor of B)
    let roleA = '';
    let roleB = 'Cháu';
    if (genB === 1) roleA = personA.gender === 1 ? 'Cha (Ba)' : 'Mẹ (Mạ)';
    else if (genB === 2) roleA = personA.gender === 1 ? 'Ông Nội' : 'Bà Nội';
    else if (genB === 3) roleA = personA.gender === 1 ? 'Ông Cố (Cụ)' : 'Bà Cố (Cụ)', roleB = 'Chắt';
    else if (genB >= 4) roleA = personA.gender === 1 ? `Ông Sơ (Đời ${genB})` : `Bà Sơ (Đời ${genB})`, roleB = 'Chút/Chít';

    return {
      description: `${personA.display_name} là ${roleA} của ${personB.display_name}`,
      detail: `Quan hệ trực hệ cách ${genB} đời (Tổ tiên — Con cháu)`,
      regionalTerms: {
        personACallsPersonB: roleB,
        personBCallsPersonA: roleA,
        branchSeniority: 'Cành Trực Hệ',
        explanation: `Người Miền Trung xưng hô theo đời: ${roleA} — ${roleB}`,
      },
    };
  }

  if (genB === 0) {
    // B is LCA (B is ancestor of A)
    let roleB = '';
    let roleA = 'Cháu';
    if (genA === 1) roleB = personB.gender === 1 ? 'Cha (Ba)' : 'Mẹ (Mạ)';
    else if (genA === 2) roleB = personB.gender === 1 ? 'Ông Nội' : 'Bà Nội';
    else if (genA === 3) roleB = personB.gender === 1 ? 'Ông Cố (Cụ)' : 'Bà Cố (Cụ)', roleA = 'Chắt';
    else if (genA >= 4) roleB = personB.gender === 1 ? `Ông Sơ (Đời ${genA})` : `Bà Sơ (Đời ${genA})`, roleA = 'Chút/Chít';

    return {
      description: `${personB.display_name} là ${roleB} của ${personA.display_name}`,
      detail: `Quan hệ trực hệ cách ${genA} đời (Tổ tiên — Con cháu)`,
      regionalTerms: {
        personACallsPersonB: roleB,
        personBCallsPersonA: roleA,
        branchSeniority: 'Cành Trực Hệ',
        explanation: `Người Miền Trung xưng hô theo đời: ${roleB} — ${roleA}`,
      },
    };
  }

  // 2. Same Generation (genA === genB): Siblings or Cousins
  if (genA === genB) {
    if (genA === 1) {
      // Siblings (Cùng cha/mẹ)
      const isAOlder = (personA.birth_year || 0) <= (personB.birth_year || 0);
      const titleA = isAOlder ? (personA.gender === 1 ? 'Anh ruột' : 'Chị ruột') : 'Em';
      const titleB = isAOlder ? 'Em' : (personB.gender === 1 ? 'Anh ruột' : 'Chị ruột');
      return {
        description: `${personA.display_name} và ${personB.display_name} là Anh/Chị em ruột`,
        detail: `Cùng ${lca.gender === 1 ? 'cha' : 'mẹ'}: ${lca.display_name} (Đời thứ ${lca.generation})`,
        regionalTerms: {
          personACallsPersonB: isAOlder ? 'Em' : (personB.gender === 1 ? 'Anh' : 'Chị'),
          personBCallsPersonA: isAOlder ? (personA.gender === 1 ? 'Anh' : 'Chị') : 'Em',
          branchSeniority: 'Anh em ruột một nhà',
          explanation: 'Xưng hô anh/chị em ruột theo tuổi tác',
        },
      };
    }

    // Cousins (genA >= 2): Central Vietnam Branch Seniority (Cành Bác vs Cành Chú/O)
    // Child of LCA on A's side:
    const childLcaA = chainA[chainA.length - 2] ? personMap.get(chainA[chainA.length - 2]) : null;
    const childLcaB = chainB[chainB.length - 2] ? personMap.get(chainB[chainB.length - 2]) : null;

    let isABranchSenior = false;
    let branchText = '';

    if (childLcaA && childLcaB && childLcaA.id !== childLcaB.id) {
      const yearA = childLcaA.birth_year || 9999;
      const yearB = childLcaB.birth_year || 9999;
      isABranchSenior = yearA <= yearB;

      const parentRoleA = childLcaA.gender === 1 ? 'Bác' : 'Cô/O';
      const parentRoleB = childLcaB.gender === 1 ? 'Chú' : 'Cô/O';
      branchText = isABranchSenior
        ? `Do cha/mẹ của ${personA.display_name} (${childLcaA.display_name}) thuộc cành Anh/Chị (${parentRoleA}) so với cành của ${personB.display_name}`
        : `Do cha/mẹ của ${personB.display_name} (${childLcaB.display_name}) thuộc cành Anh/Chị (${parentRoleB}) so with cành của ${personA.display_name}`;
    }

    const titleA = isABranchSenior
      ? (personA.gender === 1 ? 'Anh Bác' : 'Chị Bác')
      : (childLcaA?.gender === 1 ? 'Em Chú' : 'Em Cô (Em O)');

    const titleB = isABranchSenior
      ? (childLcaB?.gender === 1 ? 'Em Chú' : 'Em Cô (Em O)')
      : (personB.gender === 1 ? 'Anh Bác' : 'Chị Bác');

    return {
      description: isABranchSenior
        ? `${personA.display_name} là ${titleA} của ${personB.display_name}`
        : `${personB.display_name} là ${titleB} của ${personA.display_name}`,
      detail: `Tổ tiên chung: ${lca.display_name} (Đời thứ ${lca.generation}). ${branchText}`,
      regionalTerms: {
        personACallsPersonB: isABranchSenior ? 'Em' : titleB,
        personBCallsPersonA: isABranchSenior ? titleA : 'Em',
        branchSeniority: isABranchSenior ? 'Cành Trên (Nhánh Bác)' : 'Cành Dưới (Nhánh Chú/O)',
        explanation: 'Phong tục Miền Trung: Xưng hô anh/chị em họ theo tôn ti thứ bậc Cành Bác / Cành Chú (lớn nhỏ theo vai vế cành họ, không tính theo tuổi tác cá nhân).',
      },
    };
  }

  // 3. Different Generations (Uncles / Aunts / Nephews)
  if (genA < genB) {
    // A is higher generation than B
    const diff = genB - genA;
    const parentOfBInChain = chainB[chainB.length - 2] ? personMap.get(chainB[chainB.length - 2]) : null;
    const isFatherSide = parentOfBInChain ? parentOfBInChain.gender === 1 : true;

    let roleA = '';
    if (diff === 1) {
      if (isFatherSide) {
        if (personA.gender === 1) roleA = 'Chú / Bác';
        else roleA = 'Cô / O (Dì)';
      } else {
        if (personA.gender === 1) roleA = 'Cậu';
        else roleA = 'Dì';
      }
    } else if (diff === 2) {
      roleA = personA.gender === 1 ? 'Ông Bác / Ông Chú' : 'Bà Bác / Bà Cô (O)';
    } else {
      roleA = `Bậc Bác/Chú họ (Cách ${diff} đời)`;
    }

    return {
      description: `${personA.display_name} là bậc ${roleA} của ${personB.display_name}`,
      detail: `Tổ tiên chung: ${lca.display_name} (Đời thứ ${lca.generation}). ${personA.display_name} cách ${genA} đời, ${personB.display_name} cách ${genB} đời`,
      regionalTerms: {
        personACallsPersonB: 'Cháu',
        personBCallsPersonA: roleA,
        branchSeniority: `Bậc trên (Cách ${diff} thế hệ)`,
        explanation: `Cách xưng hô Miền Trung: ${personB.display_name} gọi ${personA.display_name} là ${roleA}, ${personA.display_name} gọi lại là Cháu.`,
      },
    };
  } else {
    // B is higher generation than A
    const diff = genA - genB;
    const parentOfAInChain = chainA[chainA.length - 2] ? personMap.get(chainA[chainA.length - 2]) : null;
    const isFatherSide = parentOfAInChain ? parentOfAInChain.gender === 1 : true;

    let roleB = '';
    if (diff === 1) {
      if (isFatherSide) {
        if (personB.gender === 1) roleB = 'Chú / Bác';
        else roleB = 'Cô / O (Dì)';
      } else {
        if (personB.gender === 1) roleB = 'Cậu';
        else roleB = 'Dì';
      }
    } else if (diff === 2) {
      roleB = personB.gender === 1 ? 'Ông Bác / Ông Chú' : 'Bà Bác / Bà Cô (O)';
    } else {
      roleB = `Bậc Bác/Chú họ (Cách ${diff} đời)`;
    }

    return {
      description: `${personB.display_name} là bậc ${roleB} của ${personA.display_name}`,
      detail: `Tổ tiên chung: ${lca.display_name} (Đời thứ ${lca.generation}). ${personA.display_name} cách ${genA} đời, ${personB.display_name} cách ${genB} đời`,
      regionalTerms: {
        personACallsPersonB: roleB,
        personBCallsPersonA: 'Cháu',
        branchSeniority: `Bậc dưới (Cách ${diff} thế hệ)`,
        explanation: `Cách xưng hô Miền Trung: ${personA.display_name} gọi ${personB.display_name} là ${roleB}, ${personB.display_name} gọi lại là Cháu.`,
      },
    };
  }
}

// ─── Main Export ────────────────────────────────────────────────────────────

export function findRelationship(
  data: TreeData,
  personAId: string,
  personBId: string,
): RelationshipResult {
  if (personAId === personBId) {
    return {
      found: false,
      path: [],
      lca: null,
      distance: 0,
      description: 'Vui lòng chọn 2 người khác nhau',
      descriptionDetail: '',
    };
  }

  const personMap = new Map<string, Person>();
  for (const p of data.people) personMap.set(p.id, p);

  const personA = personMap.get(personAId);
  const personB = personMap.get(personBId);
  if (!personA || !personB) {
    return {
      found: false,
      path: [],
      lca: null,
      distance: 0,
      description: 'Không tìm thấy thành viên',
      descriptionDetail: '',
    };
  }

  const graph = buildGraph(data);
  const parentMap = buildParentMap(data);
  const path = bfs(graph, personAId, personBId, personMap);

  if (!path) {
    return {
      found: false,
      path: [],
      lca: null,
      distance: 0,
      description: 'Không tìm thấy quan hệ trực tiếp',
      descriptionDetail: 'Hai người này không có liên kết nào trong dữ liệu gia phả',
    };
  }

  const lca = findLCA(parentMap, personMap, personAId, personBId);
  const { description, detail, regionalTerms } = describeCentralRelationship(
    personA,
    personB,
    lca,
    path,
    parentMap,
    personMap
  );

  return {
    found: true,
    path,
    lca,
    distance: path.length - 1,
    description,
    descriptionDetail: detail,
    regionalTerms,
  };
}
