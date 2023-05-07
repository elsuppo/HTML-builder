import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const originalFolder = path.join(__dirname, 'files');
const copiedFolder = path.join(__dirname, 'files-copy');

if (fs.existsSync(copiedFolder)) {
  await fs.promises.rm(copiedFolder, { recursive: true });
}

fs.promises.mkdir(copiedFolder, { recursive: true });

const files = await fs.promises.readdir(originalFolder);

files.forEach(file => {
  const originalFile = path.resolve(originalFolder, file);
  const copiedFile = path.resolve(copiedFolder, file);
  fs.promises.copyFile(originalFile, copiedFile);
})