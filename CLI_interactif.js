var fs = require('fs');
const readline = require('readline');
const input = readline.createInterface(process.stdin, process.stdout);
const prompt = require('prompt-sync')();

const f = () => {
    return new Promise(resolve => input.question("Hello\n", resolve));
}

const operation = (response) => {
	if(response == "mkdir"){
        const name = prompt('Nom du dossier: ');
		fs.mkdir(name, function (error) {  
            if (error) {  
                console.error('Echec de création du répertoire', error);  
            }   else {  
                console.log('Répertoire créé');  
            }  
        });
	} else if(response == "dir"){
        //new Promise(directory => input.question("Lecture du répertoire\n", directory));
        const name = prompt('Nom du répertoire: ');
        fs.readdir(name, function (error, files) {  
            if (error) {  
                console.error('échec de lecture du répertoire', error);  
            } else {  
                console.log('Fichiers trouvés:', files);  
            }  
        });
    } else if (response == "touch"){
        const name = prompt("Nom du fichier: ");
        const contenu = prompt("Contenu: ");
        fs.appendFile(name, contenu, function (error) {   
            if (error) {
                console.error("Erreur'", error); }   
            else console.log("Fichier créé !");
        });
        
    } else if (response == "cp"){
        const nameFichier = prompt("Nom du fichier à copier: ");
        const nameFichierCopie = prompt("Nom du fichier copié: ");
        fs.copyFile(nameFichier, nameFichierCopie, function(error) { 
            if (error) {
                console.error("Erreur'", error); } 
            else console.log("Fichier copié !"); 
        });

    } else if (response == "rm"){
        const supprimerFichier = prompt("Nom du fichier à supprimer: ");
        fs.unlink(supprimerFichier, function(error) { 
            if (error) {
                console.error("Erreur'", error); } 
            else console.log("Fichier supprimé !"); 
        });

    } else if (response == "read"){
        const readFichier = prompt("Nom du fichier: ");
        fs.readFile(readFichier, 'utf8', function(error, data) {   
            const content = data;   
            console.log(content); });
    }
    
    else { console.log("Erreur") }
};

f().then(operation);