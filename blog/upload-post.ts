import 'dotenv/config';
import fs from 'fs-extra';
import matter from 'gray-matter';
import path from 'path';
import { adminClient } from '~/supa-client';

async function uploadPost() {
  const outputDir = './blog/output';
  const files = fs.readdirSync(outputDir).filter((file) => file.endsWith('.md'));

  if (files.length === 0) {
    console.log('업로드할 파일이 없습니다.');
    return;
  }

  console.log(`총 ${files.length}개의 포스트 업로드를 시작합니다...`);

  for (const file of files) {
    const filePath = path.join(outputDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const { data, content } = matter(fileContent);

    const postData = {
      title: data.title,
      content: content,
      category_id: data.category_id,
      read_time: data.read_time,
      tag_id: data.tag_id,
    };

    const { error } = await adminClient.from('posts').insert(postData);

    if (error) {
      console.error(`실패: ${data.title}`, error);
    } else {
      console.log(`✅ ${data.title} 업로드 완료`);
    }
  }
}

uploadPost().catch((error) => {
  console.error('업로드 중 오류가 발생했습니다.', error);
});
