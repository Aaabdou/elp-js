var fs = require('fs');
const inquirer = require('inquirer');
const readline = require('readline');
/* const options = require('options')
    .option("dir") */

const input = readline.createInterface(process.stdin, process.stdout);
function askname(){
    inquirer.prompt([
        {
        name: "doss", 
        type: "input", 
        message: "Nom du dossier ?", 
        },
    ]).then((answer) => {console.log("Hello " + answer.doss);});
}
async function test(){
    input.question('Hello\n', (response) => {
        if(response == "hello") {
            console.log("Bonjour");
    
        } else if(response == "create"){
            toto = await askname();
            
            fs.mkdir(answer.doss, function (error) {  
                if (error) {  
                    console.error('échec de création du répertoire', error);  
                }   else {  
                    console.log('répertoire créé');  
                }  
            });
    
        } else{
            console.log("Error");
        }
    
        process.exit();
    });
    
    
}

input.question('Hello\n', (response) => {
	if(response == "hello") {
		console.log("Bonjour");

	} else if(response == "create"){
        await askname();
        
		fs.mkdir(answer.doss, function (error) {  
            if (error) {  
                console.error('échec de création du répertoire', error);  
            }   else {  
                console.log('répertoire créé');  
            }  
        });

	} else{
        console.log("Error");
    }

	process.exit();
});
