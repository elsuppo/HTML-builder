import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const originalFolderName = 'styles';
const bundleFolderName = 'project-dist';
const outputFileName = 'bundle.css';

const files = await fs.promises.readdir(
  path.join(__dirname, originalFolderName),
  { withFileTypes: true }
)

const outputFile = fs.createWriteStream(
  path.join(__dirname, bundleFolderName, outputFileName)
)

files.forEach(file => {
  const originalFilePath = path.join(__dirname, originalFolderName, file.name);
  if (file.isFile() && path.extname(file.name) === '.css') {
    fs.createReadStream(originalFilePath).pipe(outputFile);
  }
})