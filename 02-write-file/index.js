import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const exit = () => {
  console.log('Thank you for checking in. Goodbye!');
  process.exit();
}

console.log('Gamarjoba! Enter your message here');

process.stdin.on('data', message => {
  message.toString().trim() === 'exit' ? exit() : file.write(message);
});

process.on('SIGINT', exit);