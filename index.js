#! /usr/bin/env node
// const tools = require('./tools.js');
const ora = require('ora');
const exec = require('await-exec')
const fs = require('fs').promises;
const version = require('./package.json').version;
const prompt = require('prompt-sync')({ sigint: true });

var projectName = process.argv[2];
var inputArgs = [];
var newPort = 3000;
var errorMsg = '';

var isExpress = true;
var isMongo = false;
var isGit = false;

const expressImport = "const express = require('express');\n"
const mongoImport = "const MongoClient = require('mongodb').MongoClient;\n"

process.argv.forEach((val, index) => {
    if (index > 2) {
        inputArgs.push(val)
    }
})

isProjectNameValid = (projectName) => {
    if (projectName === '-h' || projectName === '--help') {
        showHelp()
        return false;
    } else if (projectName === '-v' || projectName === '--version') {
        console.log(`Version: ${version} \n`)
        return false;
    } else if (projectName === '' || projectName === null || projectName === undefined) {
        errorMsg = "Project name cannot be empty! \nUse --help to get examples\n";
        console.log(errorMsg)
        return false
    } else if (projectName.startsWith('-') || projectName.startsWith('_')) {
        errorMsg = "Project name cannot start with a symbol \n"
        console.log(errorMsg)
        return false
    } else if (!projectName.match("^[a-zA-Z0-9\-\_]*$")) {
        errorMsg = "Project name can contain only a-z, A-Z, 0-9 \n"
        console.log(errorMsg)
        return false
    } else {
        return true
    }
}

isArgsValid = (inputArgs, projectName) => {
    var pass;
    const validArgs = ['-p', '--port', '-git', '--git', '-md', '--mongodb'];
    if (inputArgs.every((val) => validArgs.includes(val))) {
        pass = true
    } else {
        console.log('Unknown argument detected!\nConsider using --help\n')
        pass = false
    }

    if (pass) {
        if (inputArgs.includes('-p') || inputArgs.includes('--port')) {
            let isPortNumberCorrect = false
            while (!isPortNumberCorrect) {
                let portNo = prompt('Enter port number: ');
                if (portNo < 1024 || portNo > 9999) {
                    console.log('\nPort Number must be between 1024 and 9999')
                    pass = false
                } else if (isNaN(portNo)) {
                    console.log('\nPlease enter correct integer')
                    pass = false
                } else {
                    pass = true
                    newPort = Number(portNo)
                    isPortNumberCorrect = true
                }
            }
        }
        if (inputArgs.includes('-git') || inputArgs.includes('--git')) {
            isGit = true;
        }
        if (inputArgs.includes('-md') || inputArgs.includes('--mongodb')) {
            isMongo = true;
        }
    }
    return pass
}

createBackendFolder = async (projectName) => {
    const createBackendFolderLoader = ora({
        text: 'Creating folder ' + projectName
    });
    try {
        createBackendFolderLoader.start();
        await fs.mkdir('./' + projectName + '/', (err) => {
            if (err) throw err;
        });
        var indexJS = `${isExpress ? expressImport : ''}${isMongo ? mongoImport : ''}
    
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(${newPort}, function () {
    console.log('Server is running: ${newPort}');
});`

        await fs.writeFile('./' + projectName + '/index.js', indexJS, (err) => {
            if (err) throw err;
        })
            .then(createBackendFolderLoader.text = 'Created folder: ' + projectName)
            .then(createBackendFolderLoader.succeed())
    } catch (error) {
        createBackendFolderLoader.text = 'Error creating folder ' + projectName +': Folder with same name detected!\n'
        createBackendFolderLoader.fail()
        process.exit(1)
    }
}

initialiseExpress = async (projectName) => {
    const initialiseExpressLoader = ora({
        text: 'Installing Express '
    });
    try {
        initialiseExpressLoader.start()
        await exec('cd ' + projectName + '/ && npm init -y && npm install express', (err) => {
            if (err) throw err;
        })
            .then(() => { initialiseExpressLoader.text = 'Installed Express' })
            .then(() => { initialiseExpressLoader.succeed() })
    } catch (error) {
        initialiseExpressLoader.text = 'Error installing Express'
        initialiseExpressLoader.fail()
        process.exit(1)
    }
}

initialiseGit = async (projectName) => {
    const initialiseGitLoader = ora({
        text: 'Initializing as a Git repository'
    });
    try {
        initialiseGitLoader.start()
        await exec('cd ' + projectName + '/ && git init', (err) => {
            if (err) throw err;
        })
        var ignoreGit = `node_modules/
package-lock.json
        `
        await fs.writeFile('./' + projectName + '/.gitignore', ignoreGit, (err) => {
            if (err) throw err;
        })
            .then(() => initialiseGitLoader.text = 'initialised as Git repository')
            .then(() => initialiseGitLoader.succeed())
    } catch (error) {
        initialiseGitLoader.text = 'Error initializing as git repository'
        initialiseGitLoader.fail()
        process.exit(1)
    }
}

initialiseMongo = async (projectName) => {
    const initialiseMongoLoader = ora({
        text: 'Installing Mongodb'
    });
    try {
        initialiseMongoLoader.start()
        await exec('cd ' + projectName + '/ && npm install mongodb', (err) => {
            if (err) throw err;
        })
            .then(() => initialiseMongoLoader.text = 'Installed Mongodb')
            .then(() => initialiseMongoLoader.succeed())
    } catch (error) {
        initialiseMongoLoader.text = 'Error installing Mongodb'
        initialiseMongoLoader.fail()
        process.exit(1)
    }

}

finalCheckLoader = (projectName) => {
    const finalCheckLoader = ora({
        text: 'Final checks'
    });
    finalCheckLoader.text = 'Your app is ready! \n\nRun the following command to serve your app live: \n > cd ' + projectName + ' && node index.js\n'
    finalCheckLoader.succeed()
}

showHelp = () => {
    console.log(`\nUsage: npx build-node-app [app-name] [arguments]\n\nExample: npx build-node-app hello-world\n`)
    const helpTable = [
        { arg: '-p', argument: '--port', description: 'Specify port number to run app. Default port is 3000' },
        { arg: '-md', argument: '--mongodb', description: 'Install and import mongodb to your app' },
        { arg: '-git', argument: '--git', description: 'Initialise the project as git project. Add .git and .gitignore' },
        { arg: '-v', argument: '--version', description: 'Specify version of build-node-app' },
    ];
    console.table(helpTable);
}

if (isProjectNameValid(projectName)) {
    if (isArgsValid(inputArgs, projectName)) {
        createBackendFolder(projectName)
            .then(() => isExpress ? initialiseExpress(projectName) : null)
            .then(() => isMongo ? initialiseMongo(projectName) : null)
            .then(() => isGit ? initialiseGit(projectName) : null)
            .then(() => finalCheckLoader(projectName))
    }
}