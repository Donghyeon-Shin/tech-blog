import 'dotenv/config';
import path from 'path';
import fs from 'fs-extra';
import matter from 'gray-matter';
import { adminClient } from '~/supa-client';

const WORDS_PER_MINUTE = 200;

async function processObsidian(filePath: string) {
  let fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
  const fileName = path.parse(filePath).name;
  const dir = path.dirname(filePath);

  const processData = {
    title: fileName,
    category_id: 0,
    read_time: Math.ceil(fileContent.split(' ').length / WORDS_PER_MINUTE),
    tag_id: 0,
  };

  const wikiLinkRegex = /\[\[(.*?)\.(png|jpg|jpeg|gif|svg|pdf|mp4|mov|webm)]\]/gi;
  let match;
  const matches = [];

  while ((match = wikiLinkRegex.exec(fileContent)) !== null) {
    matches.push({ fileMatch: match[0], fileName: match[1], extension: match[2] });
  }

  // console.log(matches);

  for (const item of matches) {
    const absolutePath = path.resolve(dir + '/resources', item.fileName + '.' + item.extension);

    const fullFileName = item.fileName + '.' + item.extension;

    if (await fs.pathExists(absolutePath)) {
      const ext = path.extname(absolutePath).toLowerCase();
      const uploadPath = `${fileName}/${fullFileName}`;

      // MIME 타입 결정
      let contentType = 'application/octet-stream';
      if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
        contentType = `image/${ext.slice(1)}`;
      }
      if (ext === '.svg') {
        contentType = 'image/svg+xml';
      }
      if (['.mp4', '.webm'].includes(ext)) {
        contentType = `video/${ext.slice(1)}`;
      }
      if (ext === '.pdf') {
        contentType = 'application/pdf';
      }

      // SVG는 텍스트 파일이므로 UTF-8로 읽어야 함
      const fileBuffer =
        ext === '.svg'
          ? Buffer.from(await fs.readFile(absolutePath, 'utf-8'), 'utf-8')
          : await fs.readFile(absolutePath);

      const { error } = await adminClient.storage
        .from('blog-uploads')
        .upload(uploadPath, fileBuffer, { contentType, upsert: true });

      if (error) {
        console.error(`실패: ${item.fileName}`, error);
        continue;
      }

      const {
        data: { publicUrl },
      } = adminClient.storage.from('blog-uploads').getPublicUrl(uploadPath);

      // 3. 옵시디언 문법을 표준 마크다운 문법으로 변환
      // 이미지/영상/PDF에 따라 형식을 다르게 할 수 있음
      let replacement = `![${item.fileName}](${publicUrl})`;
      if (ext === '.pdf') {
        // PDF는 이미지 링크 형식으로 변환 (나중에 렌더링 시 PDF 뷰어로 변환)
        replacement = `![📄 PDF 보기](${publicUrl})`;
      }
      if (['.mp4', '.webm', '.mov'].includes(ext)) {
        // 비디오는 HTML로 변환 (마크다운 파서가 HTML을 허용하도록 설정 필요)
        const videoType = ext === '.mp4' ? 'mp4' : ext === '.webm' ? 'webm' : ext === '.mov';
        replacement = `<video controls class="w-full rounded-md my-4"><source src="${publicUrl}" type="video/${videoType}"></video>`;
      }

      fileContent = fileContent.replace(item.fileMatch, replacement).replace(/!!\[/g, '![');
      console.log(`✅ ${item.fileName} -> ${uploadPath} 완료`);
    }
  }

  const finalFileContent = matter.stringify(fileContent, processData);

  const outputDir = './blog/output';
  await fs.ensureDir(outputDir);
  await fs.writeFile(path.join(outputDir, `${fileName}.md`), finalFileContent, 'utf-8');
}

const filePath = './blog/uploads';
const files = fs.readdirSync(filePath).filter((file) => file.endsWith('.md'));
files.forEach((file) => {
  processObsidian(path.join(filePath, file));
});
