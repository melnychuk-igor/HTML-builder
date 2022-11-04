const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdout, stdin, exit } = require('process');

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
stdout.write('Введите текст\n');

function funcExit() {
  stdout.write('Досвидание. Удачи на курсе!');
  exit(); 
}

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    funcExit();
  }

  writeStream.write(data);
});

process.on('SIGING', () => {
  funcExit();
});
