const exec = require('child_process').exec;
const fs = require('fs');
const ora = require('ora');

// var errorMsg = '';
module.exports = {
    errorMsg: '',
    isProjectNameValid: (projectName) => {
        if (projectName === '-h' || projectName === '--help') {
            console.log(`Usage: npx build-node-app [app-name]\n\nExample: npx build-node-app hello-world\n`)
            return false;
        } else if (projectName === '' || projectName === null || projectName === undefined) {
            this.errorMsg = "Project name cannot be empty! \nUse --help to get examples\n";
            console.log(this.errorMsg)
            return false
        } else if (projectName.startsWith('-') || projectName.startsWith('_')) {
            this.errorMsg = "Project name cannot start with a symbol \n"
            console.log(this.errorMsg)
            return false
        } else if (!projectName.match("^[a-zA-Z0-9\-\_]*$")) {
            this.errorMsg = "Project name can contain only a-z, A-Z, 0-9 \n"
            console.log(this.errorMsg)
            return false
        } else {
            return true
        }
    },

    createBackendFolder: async (projectName) => {
        const createBackendFolderLoader = ora({
            text: 'Creating folder ' + projectName
        });
        createBackendFolderLoader.start();
        await fs.mkdir('./' + projectName + '/', (err) => {
            if (err) throw err;
            createBackendFolderLoader.text = 'Created folder: ' + projectName
            createBackendFolderLoader.succeed()
        })
    },

    createIndexFile: async (projectName) => {
        var indexJS = `const express = require('express');
        
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000, function () {
    console.log('Server is running: 3000');
});`
        const createIndexFileLoader = ora({
            text: 'Creating index.js ' + projectName + '/index.js'
        });
        createIndexFileLoader.start()
        await fs.writeFile('./' + projectName + '/index.js', indexJS, (err) => {
            if (err) throw err;
            createIndexFileLoader.text = 'Created file: ' + projectName + '/.index.js'
            createIndexFileLoader.succeed()
        });
    },

    installExpress: async (projectName) => {
        const installExpressLoader = ora({
            text: 'Installing Express '
        });
        installExpressLoader.start()
        await exec('cd ' + projectName + '/ && npm init -y && npm install express', (err) => {
            if (err) throw err;
            installExpressLoader.text = 'Installed Express. \n\nRun the following command to serve your app live: \n > cd ' + projectName + ' && node index.js\n'
            installExpressLoader.succeed()
        })
    }
}