const fs = require("fs");
const file = fs.readFileSync("input.seqbin");
let str = "const byte data[] PROGMEM = {"
for (let i = 0; i < file.length; i++) {
    const xd = file.readUInt8(i);
    str += `${xd}, `
}
str = str.slice(0,-2) + "};"
console.log(str)