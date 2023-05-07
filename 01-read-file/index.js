import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reader = fs.createReadStream(path.resolve(__dirname, 'text.txt'), 'utf-8');
let res = '';
reader.on('data', chunk => res += chunk);
reader.on('end', () => console.log(res));