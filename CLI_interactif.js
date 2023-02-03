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
  .option("keep", "Détacher un processus")
  .option("run", "Exécuter un programme")
  .parse(process.argv);

const Hello = () => {
    return new Promise(resolve => input.question("> ", resolve));
}

function loop(){  // Boucler de manière infinie
    Hello().then(operation).finally(loop);
}

async function listDirContents(filepath) {  // lister le contenu d'un répertoire
    try {
        const files = await fs.promises.readdir(filepath);
        const detailedFilesPromises = files.map(async (file) => {
            let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
            const { size, birthtime } = fileDetails;
            return { filename: file, "size(KB)": size, created_at: birthtime };
        });
        const detailedFiles = await Promise.all(detailedFilesPromises);
        console.table(detailedFiles);  // stocker dans un tableau

    } catch (error) {
        console.error(error);
    }
}

function createDir(filepath){  // créer un dossier
    fs.mkdirSync(filepath);
    console.log('Répertoire créé'); 
}

function createFile(filepath, content){  // créer un fichier
    fs.appendFile(filepath, content, function (error) {   
        if (error) {
            console.error(error); }   
        else console.log("Fichier créé !");
    });
}

function read(fichier){  // lire un fichier
    fs.readFile(fichier, 'utf8', function(error, data) {
        if (error) {
            return console.error(error); }
        else {  
            return console.log(data); }
    });
}

const operation = (response) => {
    const responseSplit = response.split(' ');

    function arrierePlan(){  // lancer un programme en arrière plan
        if (responseSplit.pop() == "!"){
                const li = response.substring(0, response.length - 1); 
                return li.concat("&"); // ajouter & à la fin
        } else {
            return "";
        }
    }

    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.on("keypress", (str, key) => {
    if(key.ctrl && key.name == "p") {   // Ctrl + p pour sortir du shell
        process.exit(1); }
    });

    if(response == "mkdir"){
        const filepath = prompt('Chemin du dossier: ');
        return createDir(filepath);
        
	} else if(response == "dir"){  
        const name = prompt('Nom du répertoire: ');
        return listDirContents(name);

    } else if (response == "touch"){   // Créer un fichier
        const filepath = prompt("Nom du fichier: ");
        const contents = prompt("Contenu: ");
        return createFile(filepath, contents);
        
    } else if (response == "cp"){     // Copier un fichier
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
        
    } else if (response == "lp"){  // Lister les process
        const output = execSync('ps aux', { encoding: 'utf-8' }); 
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
        
        
    } else if(responseSplit[0] == "keep"){    // Détacher un processus
        const keep = responseSplit[1];
        const ops = responseSplit[2]
        // exec('disown ' + keep, (error, output) => {
        //     if(error){
        //         console.log(error);
        //     }
        //     else {
        //         console.log(output, "Processus détaché");
        //     }
        // });
        
        exec('nohup ' + String(keep, ops), function(error, stdout, stderr){
            if(stdout){
                console.log('stdout: ' + stdout);
            }
            if(stderr){
                console.log('stderr: ' + stderr);
            }
            if(error){
                return reject (error); 
            } 
        });
        
        

    } else if(response == "run"){  // Exécuter un programme
        const app = prompt("Prog: ")
        exec(app + arrierePlan(), (error, output) => {
            if(error){
                console.log(error);
            }
            else {
                console.log(output);
            }
        });

    } else {  // lancer toutes les commandes de linux
        exec(response, (error, output) => {
            if(error){
                console.log(error);
            }
            else {
                console.log(output);
            }
        });
    }
    
};

loop(); 