const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const bundlePath = path.join(__dirname,'project-dist');
const cssPath = path.join(__dirname,'styles');
const bundleFile = path.join(bundlePath,'bundle.css');
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