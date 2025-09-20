import fs from 'fs';
import path from 'path';

interface Channel {
  name: string;
  url: string;
  group?: string;
  tvgId?: string;
  tvgName?: string;
  tvgCountry?: string;
  tvgLanguage?: string;
}

const m3uPath = path.resolve(__dirname, '../public/iptv-cn.m3u');
const outputPath = path.resolve(__dirname, '../public/channels.json');

const m3uText = fs.readFileSync(m3uPath, 'utf-8');
const lines = m3uText.split('\n');

const channels: Channel[] = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('#EXTINF')) {
    const info = lines[i];
    const url = lines[i + 1];
    const nameMatch = info.match(/,(.*)$/);
    const tvgIdMatch = info.match(/tvg-id="(.*?)"/);
    const tvgNameMatch = info.match(/tvg-name="(.*?)"/);
    const tvgCountryMatch = info.match(/tvg-country="(.*?)"/);
    const tvgLanguageMatch = info.match(/tvg-language="(.*?)"/);
    const groupMatch = info.match(/group-title="(.*?)"/);

    channels.push({
      name: nameMatch?.[1] || 'Unknown',
      url,
      tvgId: tvgIdMatch?.[1],
      tvgName: tvgNameMatch?.[1],
      tvgCountry: tvgCountryMatch?.[1],
      tvgLanguage: tvgLanguageMatch?.[1],
      group: groupMatch?.[1],
    });
  }
}

fs.writeFileSync(outputPath, JSON.stringify(channels, null, 2));
console.log(`✅ Parsed ${channels.length} channels to channels.json`);
