#! /usr/bin/env node
const tools = require('./tools.js');

if (tools.isProjectNameValid(process.argv[2])) {
    tools.createBackendFolder(process.argv[2])
}