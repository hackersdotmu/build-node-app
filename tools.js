const exec = require('child_process').exec;
const fs = require('fs');
const ora = require('ora');

// var errorMsg = '';
module.exports = {

    isProjectNameValid: (projectName) => {
        if (projectName === '-h' || projectName === '--help') {
            console.log(`Usage: npx build-node-app [app-name]\n\nExample: npx build-node-app hello-world\n`)
            return false;
        } else if (projectName === '' || projectName === null || projectName === undefined) {
            this.errorMsg = "Project name cannot be empty! \nUse --help to get examples\n";
            console.log(this.errorMsg)
            return false
        } else if (projectName.startsWith('-')) {
            this.errorMsg = "Project name cannot start with '-' \n"
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
        var indexJsFile = `const express = require('express');
            
            const app = express();

            app.use(express.json());

            app.get('/', (req, res) => {
                res.send('Hello World!')
            })

            app.listen(3000, function () {
                console.log('Server is running: 3000');
            });
        `;
        const createBackendFolderLoader = ora({
            text: 'Creating folder ' + projectName
        });

        createBackendFolderLoader.start();
        await fs.mkdir('./' + projectName + '/', (err) => {
            if (err) throw err;
        });
        await fs.writeFile('./' + projectName + '/index.js', indexJsFile, (err) => {
            if (err) throw err;
        });
        await exec('cd ' + projectName + '/ && npm init -y && npm install express', (err) => {
            if (err) throw err;
            createBackendFolderLoader.text = 'Created folder: ' + projectName + '\n\n Run the following command to serve your app live: \n > cd ' + projectName + ' && node index.js\n'
            createBackendFolderLoader.succeed()
        })
    }
}