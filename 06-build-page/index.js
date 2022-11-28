const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const assetsPath = path.join(__dirname,'assets');
const bundlePath = path.join(__dirname,'project-dist');

async function createProjectDist() {
  await fsPromises.mkdir(path.join(__dirname,'project-dist'),{ recursive: true })
  console.log("folder 'project-dist' created");
}

async function bundleCSS() {
  const cssPath = path.join(__dirname,'styles');
  const bundleFile = path.join(bundlePath,'style.css');
  const bundleCompiled = fs.createWriteStream(bundleFile);
  fsPromises.readdir(cssPath)
    .then(items => {
      items.forEach(item => {
        const fileDir = path.join(cssPath,item);
        const fileName = path.basename(fileDir);
        const fileExtension = path.extname(fileDir);
        if (fileExtension === '.css') {
          const cssItem = fs.createReadStream(path.join(cssPath,fileName));
          cssItem.on('data',data => {
            bundleCompiled.write(`${data.toString()}\n`)
          })
        }
      })
    })
}

async function copyAssetsFolder() {
  await fsPromises.mkdir(path.join(bundlePath,'assets'),{ recursive: true });
  console.log("created a copy of assets folder in the project dist");

  const readAssets = await fsPromises.readdir(assetsPath);
  for (let item of readAssets) {
    const copyFrom = path.join(__dirname,'assets',item);
    const copyTo = path.join(__dirname,'project-dist','assets',item);
    if (item.isFile) {
      await fsPromises.copyFile(copyFrom,copyTo);
      console.log(`copied ${item.name} file into 'project-dist/assets' folder`);
    } else {
      // if item is a folder
      fsPromises.mkdir(path.join(__dirname,'project-dist',`assets/${item}`),{ recursive: true });
      console.log(`copied ${item} folder into 'project-dist/assets' folder`);

      const foldersContent = await fsPromises.readdir(copyFrom,{ withFileTypes: true });
      for (let file of foldersContent) {
        const newFrom = path.join(copyFrom,file.name);
        const newTo = path.join(copyTo,file.name);
        fsPromises.copyFile(newFrom,newTo);
        console.log(`copied ${file.name} file into 'project-dist/assets' folder`);
      }
    }
  }
}


// Compiling html 
async function compileHTML() {
  const componentsPath = path.join(__dirname,'components');
  const readComponents = await fsPromises.readdir(componentsPath);

  const templateHtmlPath = path.join(__dirname,'template.html');
  let readTemplateHtml = await fsPromises.readFile(templateHtmlPath,'utf-8');

  const projectDistPath = path.join(__dirname,'project-dist');
  const htmlFile = path.join(projectDistPath,'index.html');
  // const htmlCompiled = fs.createWriteStream(htmlFile);
  // const templateUpdated = fs.createWriteStream(templateHtmlPath);

  for (let component of readComponents) {
    const fileExtension = path.extname(component);
    if (fileExtension == '.html') {
      const nameOfComponent = path.parse(path.join(componentsPath,component)).name;
      let readAComponent = await fsPromises.readFile(path.join(componentsPath,component));
      readTemplateHtml = readTemplateHtml.replace(`{{${nameOfComponent}}}`,readAComponent);
    };
  }
  fs.writeFile(htmlFile,readTemplateHtml,(err) => {
    if (err) { throw err; }
  });
};

async function buildHTML() {
  // await clearDir();
  await createProjectDist();
  await copyAssetsFolder();
  await bundleCSS();
  await compileHTML()
  return true;
};
buildHTML();










