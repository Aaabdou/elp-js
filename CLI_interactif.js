//https://github.com/sfrenot/javascript/blob/master/ProjectDesc.md
var fs = require('fs');
const readline = require('readline');
const input = readline.createInterface(process.stdin, process.stdout);
const prompt = require('prompt-sync')();
const path = require("path");
const execSync = require('child_process').execSync;
const { exec } = require('child_process');
const figlet = require("figlet");
const { Command } = require("commander");
const program = new Command();
const options = program.opts();
const yargs = require("yargs");
const { stdout, stdin } = require('process');

console.log(figlet.textSync("Bonjour"));
// -h afficher les helps
program
  .usage("> commands")
  .description("Projet ELP Javascript")
  .option("mkdir", "Créer un dossier")
  .option("dir", "Afficher la liste des répertoires")
  .option("touch", "Créer un fichier")
  .option("cp", "Copier un ficher")
  .option("rm", "Supprimer un fichier")
  .option("read", "Lire un fichier")
  .option("lp", "Lister les processus en cours")
  .option("bing -k", "Tuer un processus")
  .option("bing -p", "Mettre un processus en pause")
  .option("bing -c", "Reprendre un processus")
  .parse(process.argv);

const Hello = () => {
    return new Promise(resolve => input.question("> ", resolve));
}

function loop(){
    Hello().then(operation).finally(loop);
}

async function listDirContents(filepath) {
    try {
        const files = await fs.promises.readdir(filepath);
        const detailedFilesPromises = files.map(async (file) => {
            let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
            const { size, birthtime } = fileDetails;
            return { filename: file, "size(KB)": size, created_at: birthtime };
        });
        const detailedFiles = await Promise.all(detailedFilesPromises);
        console.table(detailedFiles);

    } catch (error) {
        console.error("Error occurred while reading the directory!", error);
    }
}

function createDir(filepath){
    fs.mkdirSync(filepath);
    console.log('Répertoire créé'); 
}

function createFile(filepath, content){
    fs.appendFile(filepath, content, function (error) {   
        if (error) {
            console.error(error); }   
        else console.log("Fichier créé !");
    });
}

function read(fichier){
    fs.readFile(fichier, 'utf8', function(error, data) {
        if (error) {
            return console.error(error); }
        else {  
            return console.log(data); }
        });}

const operation = (response) => {
    const responseSplit = response.split(' ');

    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.on("keypress", (str, key) => {
    if(key.ctrl && key.name == "o") {   // Ctrl + o pour sortir du shell
        process.exit(1); }
    });

    // rajouter & à la fin -> exécuter en tâche de fond
    if (responseSplit.pop() == "!"){
        const li = response.substring(0, response.length - 1);
        const arrierePlan = li.concat("&");

    } else if(response == "mkdir"){
        const filepath = prompt('Chemin du dossier: ');
        return createDir(filepath);
        
	} else if(response == "dir"){  
        const name = prompt('Nom du répertoire: ');
        return listDirContents(name);

    } else if (response == "touch"){   // Créer un fichier
        const filepath = prompt("Nom du fichier: ");
        const contents = prompt("Contenu: ");
        return createFile(filepath, contents);
        
    } else if (response == "cp"){   // Copier un fichier
        const nameFichier = prompt("Nom du fichier à copier: ");
        const nameFichierCopie = prompt("Nom du fichier copié: ");
        fs.copyFile(nameFichier, nameFichierCopie, function(error) { 
            if (error) {
                console.error(error); } 
            else console.log("Fichier copié !"); 
        });

    } else if (response == "rm"){    // Supprimer un fichier
        const supprimerFichier = prompt("Nom du fichier à supprimer: ");
        fs.unlink(supprimerFichier, function(error) { 
            if (error) {
                console.error(error); } 
            else console.log("Fichier supprimé !"); 
        });

    } else if (response == "read"){    // Lire un fichier
        const lireFichier = prompt("Nom du fichier: ");
        return read(lireFichier);
        
    } else if (response == "lp"){  // Lister les processus en cours
        const output = execSync('ps -ef', { encoding: 'utf-8' }); 
        console.log('Processus en cours:\n', output); 

    } else if (responseSplit.length > 1 && responseSplit[0] == "bing"){  
        switch (responseSplit[0] == "bing"){   
            case responseSplit[1] == "-k":   // Tuer un processus
                const killProcess = responseSplit[2];
                execSync('kill ' + killProcess,); 
                console.log('Processus terminé');

            case responseSplit[1] == "-p":   // Mettre en pause
                const suspendProcess = responseSplit[2];
                execSync('kill -stop ' + suspendProcess); 
                console.log('Processus en pause');

            case responseSplit[1] == "-c":   // reprendre un processus
                const resumeProcess = responseSplit[2];
                execSync('kill -cont ' + resumeProcess); 
                console.log('Processus repris');
        }
        
        
    } else if(responseSplit[0] == "keep"){    //Détacher un processus
        const pid = responseSplit[1];
        exec('disown -h ' + pid, (error, output) => {
            if(error){
                console.log(error);
            }
            else {
                console.log(output, "Processus détaché");
            }

        });

    } else if(response == "run"){
        const chemin = prompt("Prog: ")
        exec('node ' + chemin, (error, output) => {
            if(error){
                console.log(error);
            }
            else {
                console.log(output);
            }
        });
    } 
    
    else { 
        console.log("Erreur!"); 
    }
};

loop();
