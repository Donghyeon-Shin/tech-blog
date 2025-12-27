import path from 'path';
import fs from 'fs-extra';

async function processObsidian(filePath: string) {
  const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
  const fileName = path.parse(filePath).name;
  const dir = path.dirname(filePath);

  const wikiLinkRegex = /\[\[(.*?)\.(png|jpg|jpeg|gif|pdf|mp4|mov|webm)]\]/gi;
  let match;
  const matches = [];

  while ((match = wikiLinkRegex.exec(fileContent)) !== null) {
    matches.push({ fileMatch: match[0], fileName: match[1] });
  }
}

const filePath = './blog/uploads';
const files = fs.readdirSync(filePath).filter((file) => file.endsWith('.md'));
files.forEach((file) => {
  processObsidian(path.join(filePath, file));
});
