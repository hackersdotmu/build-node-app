#! /usr/bin/env node
const tools = require('./tools.js');

var projectName = process.argv[2];
var inputArgs = [];

process.argv.forEach((val, index) => {
    if (index > 2) {
        inputArgs.push(val)
    }
})

if (tools.isProjectNameValid(projectName)) {
    if (tools.isArgsValid(inputArgs)) {
        tools.createBackendFolder(projectName)
            .then(() => tools.installExpress(projectName))
            .then(() => tools.createIndexFile(projectName))
    } else {
        console.log('not pass')
    }
}