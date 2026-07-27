#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║          GIA PHẢ HỌ PHẠM — Python Family Tree Exporter                      ║
║  Xuất sơ đồ cây gia phả từ Supabase sang Python                             ║
╚══════════════════════════════════════════════════════════════════════════════╝

Cách dùng:
  1. Cài thư viện:
       pip install supabase python-dotenv matplotlib networkx

  2. Tạo file .env (hoặc set environment variables):
       SUPABASE_URL=https://xxxxx.supabase.co
       SUPABASE_ANON_KEY=eyJhbGc...

  3. Chạy:
       python family_tree_export.py                     # In cây văn bản
       python family_tree_export.py --mode text         # In cây văn bản
       python family_tree_export.py --mode chart        # Vẽ biểu đồ matplotlib
       python family_tree_export.py --mode json         # Xuất ra JSON
       python family_tree_export.py --mode csv          # Xuất ra CSV
       python family_tree_export.py --mode stats        # In thống kê
       python family_tree_export.py --mode all          # Tất cả
       python family_tree_export.py --root "Phạm Văn A" # Bắt đầu từ người cụ thể
       python family_tree_export.py --gen 5             # Giới hạn số đời
"""

import os
import sys
import json
import csv
import argparse
from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime

# ─── Load .env ────────────────────────────────────────────────────────────────
try:
    from dotenv import load_dotenv
    # Try frontend/.env first (contains NEXT_PUBLIC_SUPABASE_URL)
    _fe_env = os.path.join(os.path.dirname(__file__), "frontend", ".env")
    load_dotenv(dotenv_path=_fe_env, override=False)
    load_dotenv(override=False)  # also load local .env if it exists
except ImportError:
    print("⚠  python-dotenv chưa được cài. Chạy: pip install python-dotenv")

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Thư viện 'supabase' chưa được cài.")
    print("   Chạy: pip install supabase")
    sys.exit(1)

# ─── Cấu hình ─────────────────────────────────────────────────────────────────
SUPABASE_URL = (
    os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    or os.environ.get("SUPABASE_URL", "")
)
SUPABASE_KEY = (
    os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    or os.environ.get("SUPABASE_ANON_KEY")
    or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
)


# ═══════════════════════════════════════════════════════════════════════════════
# Data Models
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Person:
    id: str
    handle: str
    display_name: str
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    surname: Optional[str] = None
    gender: int = 1                  # 1=Nam, 2=Nu
    generation: int = 1
    phai: Optional[int] = None
    chi: Optional[int] = None
    birth_year: Optional[int] = None
    birth_date: Optional[str] = None
    birth_place: Optional[str] = None
    death_year: Optional[int] = None
    death_date: Optional[str] = None
    is_living: bool = True
    is_patrilineal: bool = True
    occupation: Optional[str] = None
    biography: Optional[str] = None
    privacy_level: int = 0
    created_at: str = ""
    updated_at: str = ""

    @property
    def gender_label(self) -> str:
        return "Nam" if self.gender == 1 else "Nu" if self.gender == 2 else "?"

    @property
    def life_span(self) -> str:
        birth = str(self.birth_year) if self.birth_year else "?"
        if self.is_living:
            return f"{birth} - nay"
        death = str(self.death_year) if self.death_year else "?"
        return f"{birth} - {death}"

    @property
    def symbol(self) -> str:
        return "[Nam]" if self.gender == 1 else "[Nu]" if self.gender == 2 else "[?]"


@dataclass
class Family:
    id: str
    handle: str
    father_id: Optional[str] = None
    mother_id: Optional[str] = None
    marriage_date: Optional[str] = None
    sort_order: int = 0


@dataclass
class Child:
    id: str
    family_id: str
    person_id: str
    sort_order: int = 0


@dataclass
class TreeData:
    people: list = field(default_factory=list)       # list[Person]
    families: list = field(default_factory=list)     # list[Family]
    children: list = field(default_factory=list)     # list[Child]


# ═══════════════════════════════════════════════════════════════════════════════
# Supabase Fetcher
# ═══════════════════════════════════════════════════════════════════════════════

def fetch_tree_data(supabase_client: "Client") -> TreeData:
    """Lay toan bo du lieu gia pha tu Supabase."""
    print("Dang tai du lieu tu Supabase...")

    # Fetch people
    resp = supabase_client.table("people").select("*").order("generation").execute()
    people = [
        Person(
            id=r["id"],
            handle=r.get("handle", ""),
            display_name=r.get("display_name", ""),
            first_name=r.get("first_name"),
            middle_name=r.get("middle_name"),
            surname=r.get("surname"),
            gender=r.get("gender", 1),
            generation=r.get("generation", 1),
            phai=r.get("phai"),
            chi=r.get("chi"),
            birth_year=r.get("birth_year"),
            birth_date=r.get("birth_date"),
            birth_place=r.get("birth_place"),
            death_year=r.get("death_year"),
            death_date=r.get("death_date"),
            is_living=r.get("is_living", True),
            is_patrilineal=r.get("is_patrilineal", True),
            occupation=r.get("occupation"),
            biography=r.get("biography"),
            privacy_level=r.get("privacy_level", 0),
            created_at=r.get("created_at", ""),
            updated_at=r.get("updated_at", ""),
        )
        for r in resp.data or []
        if r.get("privacy_level", 0) != 2  # bo qua nguoi rieng tu
    ]
    print(f"  OK: {len(people)} nguoi")

    # Fetch families
    resp = supabase_client.table("families").select("*").order("sort_order").execute()
    families = [
        Family(
            id=r["id"],
            handle=r.get("handle", ""),
            father_id=r.get("father_id"),
            mother_id=r.get("mother_id"),
            marriage_date=r.get("marriage_date"),
            sort_order=r.get("sort_order", 0),
        )
        for r in resp.data or []
    ]
    print(f"  OK: {len(families)} gia dinh")

    # Fetch children
    resp = supabase_client.table("children").select("*").order("sort_order").execute()
    children = [
        Child(
            id=r["id"],
            family_id=r["family_id"],
            person_id=r["person_id"],
            sort_order=r.get("sort_order", 0),
        )
        for r in resp.data or []
    ]
    print(f"  OK: {len(children)} quan he cha-con")

    return TreeData(people=people, families=families, children=children)


# ═══════════════════════════════════════════════════════════════════════════════
# Tree Builder — index & helper methods
# ═══════════════════════════════════════════════════════════════════════════════

class FamilyTreeBuilder:
    """Xay dung cay gia pha tu TreeData."""

    def __init__(self, data: TreeData):
        self.data = data
        self.person_map = {p.id: p for p in data.people}
        self.family_map = {f.id: f for f in data.families}

        # person_id -> list of family_id (la cha/me trong gia dinh do)
        self.person_families: dict = {}
        for fam in data.families:
            for pid in [fam.father_id, fam.mother_id]:
                if pid:
                    self.person_families.setdefault(pid, []).append(fam.id)

        # person_id -> parent family_id (gia dinh ma nguoi nay la con)
        self.child_of_family: dict = {
            c.person_id: c.family_id for c in data.children
        }

        # family_id -> list of child person_id (sorted by sort_order)
        self.family_children: dict = {}
        for c in sorted(data.children, key=lambda x: x.sort_order):
            self.family_children.setdefault(c.family_id, []).append(c.person_id)

    def get_roots(self) -> list:
        """Tra ve nhung nguoi khong co cha me nao trong he thong."""
        has_parents = set(self.child_of_family.keys())
        roots = [p for p in self.data.people if p.id not in has_parents]
        return sorted(roots, key=lambda p: (p.generation, p.display_name))

    def get_children_of(self, person_id: str) -> list:
        """Lay danh sach con cua mot nguoi (qua tat ca hon nhan)."""
        result = []
        seen = set()
        for fam_id in self.person_families.get(person_id, []):
            for child_id in self.family_children.get(fam_id, []):
                if child_id not in seen and child_id in self.person_map:
                    result.append(self.person_map[child_id])
                    seen.add(child_id)
        return result

    def get_spouse_of(self, person_id: str) -> list:
        """Lay danh sach vo/chong."""
        spouses = []
        for fam_id in self.person_families.get(person_id, []):
            fam = self.family_map.get(fam_id)
            if not fam:
                continue
            spouse_id = fam.mother_id if fam.father_id == person_id else fam.father_id
            if spouse_id and spouse_id in self.person_map:
                spouses.append(self.person_map[spouse_id])
        return spouses

    def get_parents_of(self, person_id: str):
        """Lay cha va me cua mot nguoi. Returns (father, mother)."""
        fam_id = self.child_of_family.get(person_id)
        if not fam_id:
            return None, None
        fam = self.family_map.get(fam_id)
        if not fam:
            return None, None
        father = self.person_map.get(fam.father_id) if fam.father_id else None
        mother = self.person_map.get(fam.mother_id) if fam.mother_id else None
        return father, mother


# ═══════════════════════════════════════════════════════════════════════════════
# Mode 1: Text Tree (ASCII)
# ═══════════════════════════════════════════════════════════════════════════════

def print_text_tree(
    builder: FamilyTreeBuilder,
    root_name: Optional[str] = None,
    max_gen: Optional[int] = None,
) -> None:
    """In so do cay gia pha dang van ban."""
    print()
    print("=" * 65)
    print("         SO DO CAY GIA PHA HO PHAM")
    print("=" * 65)
    print()

    if root_name:
        roots = [
            p for p in builder.data.people
            if root_name.lower() in p.display_name.lower()
        ]
        if not roots:
            print(f"Khong tim thay nguoi ten '{root_name}'")
            return
    else:
        roots = builder.get_roots()

    if not roots:
        # Fallback: find person with smallest generation
        min_gen = min(p.generation for p in builder.data.people)
        roots = [p for p in builder.data.people if p.generation == min_gen]

    visited: set = set()

    def _print_node(person: Person, prefix: str = "", is_last: bool = True, depth: int = 0) -> None:
        if person.id in visited:
            return
        if max_gen is not None and depth >= max_gen:
            return
        visited.add(person.id)

        connector = "+-- " if is_last else "+-- "
        gender_tag = "(Nam)" if person.gender == 1 else "(Nu)"
        life = f" [{person.life_span}]" if person.birth_year or person.death_year else ""
        gen_info = f" Doi {person.generation}" if person.generation else ""

        print(f"{prefix}{connector}{person.display_name} {gender_tag}{life}{gen_info}")

        child_prefix = prefix + ("    " if is_last else "|   ")

        # Hien thi vo/chong
        spouses = builder.get_spouse_of(person.id)
        for sp in spouses:
            sp_gender = "(Nu)" if sp.gender == 2 else "(Nam)"
            sp_life = f" [{sp.life_span}]" if sp.birth_year or sp.death_year else ""
            print(f"{child_prefix}  [vo/chong] {sp.display_name} {sp_gender}{sp_life}")

        # De quy vao con cai
        children = builder.get_children_of(person.id)
        if person.gender == 2:
            # Tranh in con tu phia me neu cha da duoc in
            father_child_ids = set()
            for fam_id in builder.person_families.get(person.id, []):
                fam = builder.family_map.get(fam_id)
                if fam and fam.father_id and fam.father_id in visited:
                    father_child_ids.update(builder.family_children.get(fam_id, []))
            children = [c for c in children if c.id not in father_child_ids]

        for i, child in enumerate(children):
            _print_node(child, child_prefix, i == len(children) - 1, depth + 1)

    for i, root in enumerate(roots):
        _print_node(root, "", i == len(roots) - 1)
        print()

    if builder.data.people:
        gen_min = min(p.generation for p in builder.data.people)
        gen_max = max(p.generation for p in builder.data.people)
        print(f"Tong cong: {len(builder.data.people)} nguoi | "
              f"{len(builder.data.families)} gia dinh | "
              f"Doi {gen_min} den {gen_max}")


# ═══════════════════════════════════════════════════════════════════════════════
# Mode 2: Matplotlib Chart
# ═══════════════════════════════════════════════════════════════════════════════

def draw_chart(
    builder: FamilyTreeBuilder,
    root_name: Optional[str] = None,
    max_gen: Optional[int] = None,
    output_file: Optional[str] = None,
) -> None:
    """Ve so do cay bang matplotlib + networkx."""
    try:
        import matplotlib
        import matplotlib.pyplot as plt
        import matplotlib.patches as mpatches
        import networkx as nx
        matplotlib.rcParams["font.family"] = ["DejaVu Sans", "Arial", "sans-serif"]
    except ImportError:
        print("Can cai: pip install matplotlib networkx")
        return

    print("Dang ve so do cay gia pha...")

    # Colors
    MALE_COLOR    = "#4A90D9"
    FEMALE_COLOR  = "#E87D9A"
    DECEASED_COLOR = "#9B9B9B"

    G = nx.DiGraph()
    pos: dict = {}
    colors: dict = {}
    labels: dict = {}

    # Select people to show
    people_to_show = list(builder.data.people)
    if root_name:
        roots = [p for p in builder.data.people if root_name.lower() in p.display_name.lower()]
        if not roots:
            print(f"Khong tim thay '{root_name}'")
            return
        # BFS collect descendants
        queue = list(roots)
        seen_ids: set = set(r.id for r in roots)
        while queue:
            cur = queue.pop(0)
            for child in builder.get_children_of(cur.id):
                if child.id not in seen_ids:
                    seen_ids.add(child.id)
                    queue.append(child)
        # Also include spouses
        for pid in list(seen_ids):
            for sp in builder.get_spouse_of(pid):
                seen_ids.add(sp.id)
        people_to_show = [p for p in builder.data.people if p.id in seen_ids]

    if max_gen:
        if people_to_show:
            min_g = min(p.generation for p in people_to_show)
            people_to_show = [p for p in people_to_show if p.generation - min_g < max_gen]

    # Group by generation
    gen_groups: dict = {}
    for p in people_to_show:
        gen_groups.setdefault(p.generation, []).append(p)

    # Layout
    for gen, members in gen_groups.items():
        n = len(members)
        sorted_members = sorted(members, key=lambda x: x.display_name)
        for i, person in enumerate(sorted_members):
            x = (i - (n - 1) / 2.0) * 3.0
            y = -gen * 3.5
            pos[person.id] = (x, y)

            name = person.display_name
            if len(name) > 10:
                name = name[:9] + "..."
            life = f"\n({person.birth_year})" if person.birth_year else ""
            if not person.is_living and person.birth_year and person.death_year:
                life = f"\n({person.birth_year}-{person.death_year})"
            labels[person.id] = f"{name}{life}"

            if not person.is_living:
                colors[person.id] = DECEASED_COLOR
            elif person.gender == 1:
                colors[person.id] = MALE_COLOR
            else:
                colors[person.id] = FEMALE_COLOR

            G.add_node(person.id)

    # Edges
    person_ids = {p.id for p in people_to_show}
    for child_rec in builder.data.children:
        fam = builder.family_map.get(child_rec.family_id)
        if not fam:
            continue
        child_id = child_rec.person_id
        if child_id not in person_ids:
            continue
        for parent_id in [fam.father_id, fam.mother_id]:
            if parent_id and parent_id in person_ids:
                G.add_edge(parent_id, child_id)

    # Figure sizing
    n_people = len(people_to_show)
    fig_w = max(14, n_people * 1.0)
    fig_h = max(8, len(gen_groups) * 4.0)

    fig, ax = plt.subplots(figsize=(fig_w, fig_h))
    fig.patch.set_facecolor("#1A1A2E")
    ax.set_facecolor("#16213E")

    node_list = [n for n in G.nodes() if n in pos]
    node_colors = [colors.get(n, "#888") for n in node_list]
    node_pos = {n: pos[n] for n in node_list}

    nx.draw_networkx_nodes(
        G, node_pos, nodelist=node_list,
        node_color=node_colors, node_size=1800,
        alpha=0.92, ax=ax
    )
    nx.draw_networkx_edges(
        G, node_pos,
        edge_color="#A0C4FF", arrows=True,
        arrowsize=20, width=1.8, alpha=0.75,
        ax=ax
    )
    nx.draw_networkx_labels(
        G, node_pos, labels=labels,
        font_size=7, font_color="white", ax=ax
    )

    # Generation markers
    if gen_groups and node_pos:
        x_min = min(x for x, y in node_pos.values()) - 1.5
        for gen in sorted(gen_groups.keys()):
            y = -gen * 3.5
            ax.text(x_min, y, f" Doi {gen}", color="#FFD700",
                    fontsize=9, va="center",
                    bbox=dict(boxstyle="round,pad=0.3", fc="#0F3460", ec="#FFD700", alpha=0.9))

    # Legend
    patches = [
        mpatches.Patch(color=MALE_COLOR, label="Nam (con song)"),
        mpatches.Patch(color=FEMALE_COLOR, label="Nu (con song)"),
        mpatches.Patch(color=DECEASED_COLOR, label="Da mat"),
    ]
    ax.legend(handles=patches, loc="upper right",
              facecolor="#0F3460", edgecolor="#A0C4FF",
              labelcolor="white", fontsize=9)

    if people_to_show and gen_groups:
        gen_min = min(gen_groups.keys())
        gen_max = max(gen_groups.keys())
        ax.set_title(
            f"So Do Cay Gia Pha Ho Pham  |  {len(people_to_show)} nguoi  |  Doi {gen_min}-{gen_max}",
            color="white", fontsize=13, pad=15, fontweight="bold"
        )
    ax.axis("off")
    plt.tight_layout()

    if output_file:
        plt.savefig(output_file, dpi=150, bbox_inches="tight",
                    facecolor=fig.get_facecolor())
        print(f"  Da luu: {output_file}")
    else:
        plt.show()


# ═══════════════════════════════════════════════════════════════════════════════
# Mode 3: JSON Export
# ═══════════════════════════════════════════════════════════════════════════════

def export_json(builder: FamilyTreeBuilder, output_file: str = "family_tree.json") -> None:
    """Xuat toan bo cay gia pha ra JSON."""

    def person_to_dict(p: Person) -> dict:
        father, mother = builder.get_parents_of(p.id)
        children = builder.get_children_of(p.id)
        spouses = builder.get_spouse_of(p.id)
        return {
            "id": p.id,
            "handle": p.handle,
            "display_name": p.display_name,
            "gender": p.gender_label,
            "generation": p.generation,
            "phai": p.phai,
            "chi": p.chi,
            "birth_year": p.birth_year,
            "birth_date": p.birth_date,
            "birth_place": p.birth_place,
            "death_year": p.death_year,
            "death_date": p.death_date,
            "is_living": p.is_living,
            "is_patrilineal": p.is_patrilineal,
            "occupation": p.occupation,
            "father": father.display_name if father else None,
            "father_id": father.id if father else None,
            "mother": mother.display_name if mother else None,
            "mother_id": mother.id if mother else None,
            "spouses": [s.display_name for s in spouses],
            "children": [c.display_name for c in children],
            "children_ids": [c.id for c in children],
        }

    roots = builder.get_roots()
    gen_min = min(p.generation for p in builder.data.people) if builder.data.people else 0
    gen_max = max(p.generation for p in builder.data.people) if builder.data.people else 0

    output = {
        "exported_at": datetime.now().isoformat(),
        "total_people": len(builder.data.people),
        "total_families": len(builder.data.families),
        "generations": {"min": gen_min, "max": gen_max},
        "roots": [r.display_name for r in roots],
        "people": [person_to_dict(p) for p in builder.data.people],
    }

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"  Da xuat JSON: {output_file} ({len(builder.data.people)} nguoi)")


# ═══════════════════════════════════════════════════════════════════════════════
# Mode 4: CSV Export
# ═══════════════════════════════════════════════════════════════════════════════

def export_csv(builder: FamilyTreeBuilder, output_file: str = "family_tree.csv") -> None:
    """Xuat danh sach nguoi ra CSV (UTF-8 BOM cho Excel)."""
    headers = [
        "Ho ten", "Gioi tinh", "Doi", "Phai", "Chi",
        "Nam sinh", "Noi sinh", "Nam mat", "Con song",
        "Nghe nghiep", "Ten cha", "Ten me", "Vo/Chong",
        "So con", "Con cai",
    ]

    with open(output_file, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for person in sorted(builder.data.people, key=lambda p: (p.generation, p.display_name)):
            father, mother = builder.get_parents_of(person.id)
            spouses = builder.get_spouse_of(person.id)
            children = builder.get_children_of(person.id)
            writer.writerow([
                person.display_name,
                person.gender_label,
                person.generation,
                person.phai or "",
                person.chi or "",
                person.birth_year or "",
                person.birth_place or "",
                person.death_year or "",
                "Co" if person.is_living else "Khong",
                person.occupation or "",
                father.display_name if father else "",
                mother.display_name if mother else "",
                "; ".join(s.display_name for s in spouses),
                len(children),
                "; ".join(c.display_name for c in children),
            ])

    print(f"  Da xuat CSV: {output_file} ({len(builder.data.people)} nguoi)")


# ═══════════════════════════════════════════════════════════════════════════════
# Mode 5: Statistics
# ═══════════════════════════════════════════════════════════════════════════════

def print_statistics(builder: FamilyTreeBuilder) -> None:
    """In thong ke tong quan."""
    people = builder.data.people
    if not people:
        print("Khong co du lieu.")
        return

    print()
    print("=" * 65)
    print("                   THONG KE GIA PHA")
    print("=" * 65)

    total = len(people)
    male   = sum(1 for p in people if p.gender == 1)
    female = sum(1 for p in people if p.gender == 2)
    living = sum(1 for p in people if p.is_living)
    patrilineal = sum(1 for p in people if p.is_patrilineal)

    gen_min = min(p.generation for p in people)
    gen_max = max(p.generation for p in people)

    print(f"  Tong so nguoi     : {total}")
    print(f"  Nam               : {male} ({male/total*100:.1f}%)")
    print(f"  Nu                : {female} ({female/total*100:.1f}%)")
    print(f"  Con song          : {living} ({living/total*100:.1f}%)")
    print(f"  Dong noi          : {patrilineal}")
    print(f"  So doi            : {gen_max - gen_min + 1} (Doi {gen_min} den {gen_max})")
    print(f"  So gia dinh       : {len(builder.data.families)}")

    print()
    print("  Thong ke theo doi:")
    print("  " + "-" * 50)
    gen_map: dict = {}
    for p in people:
        gen_map.setdefault(p.generation, []).append(p)

    for gen in sorted(gen_map.keys()):
        members = gen_map[gen]
        n = len(members)
        m = sum(1 for p in members if p.gender == 1)
        f = sum(1 for p in members if p.gender == 2)
        bar = "#" * min(n, 40)
        print(f"  Doi {gen:2d}: {n:3d} nguoi (Nam:{m} Nu:{f})  {bar}")

    print()


# ═══════════════════════════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════════════════════════

def connect_supabase() -> "Client":
    """Ket noi Supabase."""
    url = SUPABASE_URL
    key = SUPABASE_KEY

    if not url or not key:
        print("THIEU THONG TIN KET NOI SUPABASE!")
        print()
        print("Cach 1: Tao file .env trong thu muc nay:")
        print("  SUPABASE_URL=https://xxxxx.supabase.co")
        print("  SUPABASE_ANON_KEY=eyJhbGc...")
        print()
        print("Cach 2: Set environment variables:")
        print("  set SUPABASE_URL=https://xxxxx.supabase.co")
        print("  set SUPABASE_ANON_KEY=eyJhbGc...")
        print()
        if url:
            print(f"URL hien tai: {url}")
        sys.exit(1)

    print(f"Ket noi: {url}")
    return create_client(url, key)


def main():
    parser = argparse.ArgumentParser(
        description="Xuat so do cay gia pha Ho Pham tu Supabase",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        "--mode", "-m",
        choices=["text", "chart", "json", "csv", "stats", "all"],
        default="text",
        help="Che do xuat: text (mac dinh), chart, json, csv, stats, all"
    )
    parser.add_argument(
        "--root", "-r",
        type=str, default=None,
        help="Ten nguoi goc de bat dau cay (mac dinh: tat ca goc)"
    )
    parser.add_argument(
        "--gen", "-g",
        type=int, default=None,
        help="Gioi han so doi hien thi"
    )
    parser.add_argument(
        "--output", "-o",
        type=str, default=None,
        help="File output (tu dong theo dinh dang neu khong chi dinh)"
    )
    parser.add_argument(
        "--url",
        type=str, default=None,
        help="Supabase URL (ghi de .env)"
    )
    parser.add_argument(
        "--key",
        type=str, default=None,
        help="Supabase anon key (ghi de .env)"
    )

    args = parser.parse_args()

    # Override from CLI
    global SUPABASE_URL, SUPABASE_KEY
    if args.url:
        SUPABASE_URL = args.url
    if args.key:
        SUPABASE_KEY = args.key

    # Ket noi & lay du lieu
    client = connect_supabase()
    data = fetch_tree_data(client)

    if not data.people:
        print("Khong co du lieu trong database!")
        return

    builder = FamilyTreeBuilder(data)

    mode = args.mode
    date_str = datetime.now().strftime("%Y%m%d_%H%M")

    if mode in ("stats", "all"):
        print_statistics(builder)

    if mode in ("text", "all"):
        print_text_tree(builder, root_name=args.root, max_gen=args.gen)

    if mode in ("chart", "all"):
        out = args.output or f"gia_pha_chart_{date_str}.png"
        draw_chart(builder, root_name=args.root, max_gen=args.gen, output_file=out)

    if mode in ("json", "all"):
        out = args.output or f"gia_pha_{date_str}.json"
        export_json(builder, output_file=out)

    if mode in ("csv", "all"):
        out = args.output or f"gia_pha_{date_str}.csv"
        export_csv(builder, output_file=out)

    print()
    print("Hoan thanh!")


if __name__ == "__main__":
    main()
