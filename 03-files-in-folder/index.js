import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const secretFolder = path.join(__dirname, 'secret-folder');

const files = await fs.promises.readdir(secretFolder, { withFileTypes: true });

files.forEach(async (file) => {
  if (file.isFile()) {
    const fileName = path.basename(file.name, path.extname(file.name));
    const fileExtension = path.extname(file.name).slice(1);
    const stats = await fs.promises.stat(path.join(secretFolder, file.name));
    const fileSize = parseFloat((stats.size / 1024).toFixed(3));

    console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
  }
});