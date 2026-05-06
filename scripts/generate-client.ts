import fs from 'fs';
import path from 'path';

const src = JSON.parse(fs.readFileSync(path.resolve('data/destinations.json'), 'utf-8'));

const lines = src.map((d: any) => {
  const season = JSON.stringify(d.season ?? []);
  const theme = JSON.stringify(d.theme ?? []);
  return `  { name: '${d.name}', tag: '${d.tag}', emoji: '${d.emoji}', lat: ${d.lat}, lng: ${d.lng}, season: ${season}, theme: ${theme} },`;
});

const content = `export interface Destination {
  name: string;
  tag: string;
  emoji: string;
  lat: number;
  lng: number;
  season: string[];
  theme: string[];
}

export const DESTINATIONS: Destination[] = [
${lines.join('\n')}
];
`;

fs.writeFileSync(path.resolve('data/destinations-client.ts'), content, 'utf-8');
console.log(`✅ destinations-client.ts 생성 완료 (${src.length}개)`);
