const fs = require('fs');
const path = require('path');
const process = require('process');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
stream.on('data', (part) => process.stdout.write(part));
