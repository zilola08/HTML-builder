const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const filePath = path.join(__dirname, 'text.txt');
const writeFile = fs.createWriteStream(filePath);

const stopAndExit = () => {
  process.stdout.write("\nWas nice chatting with you! Come back soon! :)\n");
  exit();
}

process.stdout.write('Hey, how you doin`? Talk to me by entering your message here: \n');

process.stdin.on('data', function copy(data){
  if(data.toString().trim() === "exit") {
    stopAndExit();
  }
  writeFile.write(data.toString().trim() + '\n');
});

process.on('SIGINT', stopAndExit)
