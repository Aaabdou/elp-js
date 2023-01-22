/* async function waitKeyPressed() {
    return new Promise(resolve => {
        const wasRaw = process.stdin.isRaw;
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once("data", (data) => {
            process.stdin.pause();
            process.stdin.setRawMode(wasRaw);
            resolve(data.toString());
        });
    });
}

let key = waitKeyPressed(); 
console.log("You pressed key:", key); */

const readline = require('readline');
 
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (str, key) => {
    //console.log(key)
    if(key.ctrl && key.name == "o") 
        { process.exit(1); }
})