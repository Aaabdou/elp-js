const prompt = require('prompt-sync')();

const testInput = prompt("commande: ");
const responseSplit = testInput.split(' ');
responseSplit.push('&');
console.log(responseSplit);


response.endsWith("!")
if (responseSplit.pop() == "!"){
    console.log(response.concat(' ', "&"));
}
