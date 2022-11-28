const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const assetsPath = path.join(__dirname,'assets');
const bundlePath = path.join(__dirname,'project-dist');

async function deleteOldBundle() {
  await fsPromises.rm(path.resolve(__dirname,'project-dist'),{ recursive: true,force: true });
}

async function createProjectDist() {
  //async function returns a promise, which we can await later 
  await fsPromises.mkdir(path.join(__dirname,'project-dist'),{ recursive: true })
  // recursive: true => If we run this program for the second time (when the folder will have been created) without "recursive: true", then it will display an error message as the directory already exists. To overcome this error we will use the "recursive: true".

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
        const fileName = path.basename(fileDir); //gets the "file.ext" of the last item on the indicated path
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

  const readAssets = await fsPromises.readdir(assetsPath,{ withFileTypes: true }); //"withFileTypes: true" is needed to get an array as a result (we need it to use props of arrays and the "isFile()" method). Note! When using "withFileTypes: true", the items will be converted into objects, so we need to use" file.name" to get the names. When "withFileTypes: true" is not used, the filenames can be get simply by referring to the "file"
  for (let item of readAssets) {
    const copyFrom = path.join(__dirname,'assets',item.name);
    const copyTo = path.join(__dirname,'project-dist','assets',item.name);
    if (item.isFile()) {
      await fsPromises.copyFile(copyFrom,copyTo);
      console.log(`copied ${item.name} file into 'project-dist/assets' folder`);
    } else {
      // if item is not a file but is a folder
      fsPromises.mkdir(path.join(__dirname,'project-dist',`assets/${item.name}`),{ recursive: true });
      console.log(`copied ${item.name} folder into 'project-dist/assets' folder`);

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
  const readComponents = await fsPromises.readdir(componentsPath,{ withFileTypes: true });

  const templateHtmlPath = path.join(__dirname,'template.html');
  let readTemplateHtml = await fsPromises.readFile(templateHtmlPath,'utf-8');

  const projectDistPath = path.join(__dirname,'project-dist');
  const htmlFile = path.join(projectDistPath,'index.html');

  for (let component of readComponents) {
    // console.log(`${component}, ${component.name}`)
    const fileExtension = path.extname(component.name);
    if (fileExtension == '.html') {
      const nameOfComponent = path.parse(path.join(componentsPath,component.name)).name;
      // The path.parse() method is used to return an object whose properties represent the given path. This method returns the following properties: root (root name), dir (directory name), base (filename with extension), ext (only extension), name (only filename)

      let readAComponent = await fsPromises.readFile(path.join(componentsPath,component.name));
      //The fs.readFile() method is an inbuilt method which is used to read the file. This method read the entire file into buffer. So we can modify the content of the file in the buffer if we save the result of the "readFile" as a variable (e.g. by using ".replace" without modifying the original file!!!)
      readTemplateHtml = readTemplateHtml.replace(`{{${nameOfComponent}}}`,readAComponent);
    };
  }
  fs.writeFile(htmlFile,readTemplateHtml,(err) => {
    if (err) { throw err; }
  });
};

async function buildHTML() {
  await deleteOldBundle();
  await createProjectDist();
  await copyAssetsFolder();
  await bundleCSS();
  await compileHTML()
  return true;
};
buildHTML();










