import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateHtml = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const originalAssetsFolder = path.join(__dirname, 'assets');
const originalStylesFolder = path.join(__dirname, 'styles');

const bundleFolder = path.join(__dirname, 'project-dist');
const bundleAssetsFolder = path.join(bundleFolder, 'assets');
const bundleStyleName = 'style.css';

// rewrite bundle folder
if (fs.existsSync(bundleFolder)) {
  await fs.promises.rm(bundleFolder, { recursive: true });
}

fs.promises.mkdir(bundleFolder, { recursive: true });

// copy assets folder
const copyFolder = async (originalFolder, newFolder) => {
  fs.promises.mkdir(newFolder, { recursive: true });
  const files = await fs.promises.readdir(originalFolder, { withFileTypes: true });

  files.forEach(async (file) => {
    const originalFile = path.resolve(originalFolder, file.name);
    const copiedFile = path.resolve(newFolder, file.name);

    if (file.isFile()) {
      fs.promises.copyFile(originalFile, copiedFile);
    } else {
      copyFolder(originalFile, copiedFile);
    }
  })
}

copyFolder(originalAssetsFolder, bundleAssetsFolder);

// insert components into template.html
let template = await fs.promises.readFile(templateHtml, 'utf8');

template.match(/{{(.*?)}}/g).forEach(async (item) => {
  const componentFileName = `${item.slice(2).slice(0, -2)}.html`;
  const component = path.join(componentsFolder, componentFileName);
  const componentHtml = await fs.promises.readFile(component, 'utf8');

  template = template.replace(item, componentHtml);

  await fs.promises.writeFile(
    path.join(bundleFolder, 'index.html'),
    template,
    'utf-8'
  );
})

// build style.css
const styleFiles = await fs.promises.readdir(originalStylesFolder, { withFileTypes: true });
const output = fs.createWriteStream(path.join(bundleFolder, bundleStyleName));

styleFiles.forEach(file => {
  const filePath = path.join(originalStylesFolder, file.name);
  if (file.isFile() && path.extname(file.name) === '.css') {
    const input = fs.createReadStream(filePath);
    input.on('data', data => {
      output.write(data.toString() + '\n');
    })
  }
})