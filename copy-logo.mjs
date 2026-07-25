import fs from 'fs';
import path from 'path';

const src = 'C:\\Users\\pctua\\.gemini\\antigravity-ide\\brain\\ab8529bd-557b-467b-b432-2f7f658c5d42\\media__1784815468249.jpg';
const destPublicPng = path.join(process.cwd(), 'frontend', 'public', 'clan-logo.png');
const destPublicJpg = path.join(process.cwd(), 'frontend', 'public', 'clan-logo.jpg');
const destPublicLogoPng = path.join(process.cwd(), 'frontend', 'public', 'logo.png');
const destPublicFavicon = path.join(process.cwd(), 'frontend', 'public', 'favicon.ico');
const destTsBase64 = path.join(process.cwd(), 'frontend', 'src', 'components', 'common', 'clan-logo-base64.ts');

const imgBuffer = fs.readFileSync(src);
fs.writeFileSync(destPublicPng, imgBuffer);
fs.writeFileSync(destPublicJpg, imgBuffer);
fs.writeFileSync(destPublicLogoPng, imgBuffer);
fs.writeFileSync(destPublicFavicon, imgBuffer);

const b64 = imgBuffer.toString('base64');
const tsContent = `/**
 * Official Base64 Data URL for Tộc Phạm Văn An Trạch Logo
 */
export const CLAN_LOGO_BASE64 = 'data:image/jpeg;base64,${b64}';
`;

fs.writeFileSync(destTsBase64, tsContent, 'utf8');

console.log('Successfully generated logo image files & base64 data component!');
