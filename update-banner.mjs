import fs from 'fs';
import path from 'path';

const srcBanner = 'C:\\Users\\pctua\\.gemini\\antigravity-ide\\brain\\ab8529bd-557b-467b-b432-2f7f658c5d42\\media__1784816156457.jpg';

const destPublicBannerJpg = path.join(process.cwd(), 'frontend', 'public', 'clan-banner.jpg');
const destPublicBannerPng = path.join(process.cwd(), 'frontend', 'public', 'clan-banner.png');
const destPublicBanner2 = path.join(process.cwd(), 'frontend', 'public', 'banner.jpg');
const destTsBase64 = path.join(process.cwd(), 'frontend', 'src', 'components', 'common', 'clan-banner-base64.ts');

const bannerBuffer = fs.readFileSync(srcBanner);
fs.writeFileSync(destPublicBannerJpg, bannerBuffer);
fs.writeFileSync(destPublicBannerPng, bannerBuffer);
fs.writeFileSync(destPublicBanner2, bannerBuffer);

const b64 = bannerBuffer.toString('base64');
const tsContent = `/**
 * Official Base64 Data URL for Tộc Phạm Văn An Trạch Banner
 */
export const CLAN_BANNER_BASE64 = 'data:image/jpeg;base64,${b64}';
`;

fs.writeFileSync(destTsBase64, tsContent, 'utf8');

console.log('Successfully generated banner image assets and base64 TS file!');
