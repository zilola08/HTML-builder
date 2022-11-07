const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const fileContent = fs.createReadStream(filePath, 'utf-8');

fileContent.on('data', function read(data){
  process.stdout.write(data)
});

