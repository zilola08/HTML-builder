const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const folderPath = path.join(__dirname,'files');

fsPromises.mkdir(path.join(__dirname,'files-copy'),{ recursive: true })
  .then(console.log("folder 'files-copy' created"));

fsPromises.readdir(folderPath)
  .then(items => {
    items.forEach(item => {
      const fileDir = path.join(__dirname,'files',item);
      fsPromises.copyFile(fileDir,path.join(__dirname,'files-copy',item))
        .then(
          console.log(`copied ${item} into 'files-copy' folder`)
        )
    })
  })


