#! /usr/bin/env node
const tools = require('./tools.js');

var projectName = process.argv[2];

if (tools.isProjectNameValid(projectName)) {

    tools.createBackendFolder(projectName)
        .then(() => tools.installExpress(projectName))
        .then(() => tools.createIndexFile(projectName))
}