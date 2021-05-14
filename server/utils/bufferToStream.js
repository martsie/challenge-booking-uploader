const { Duplex } = require('stream');

// From https://stackoverflow.com/a/44091532
function bufferToStream(myBuuffer) {
  let tmp = new Duplex();
  tmp.push(myBuuffer);
  tmp.push(null);
  return tmp;
}

module.exports = bufferToStream;
