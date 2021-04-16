const exec = require('child_process').exec;
const fs = require('fs');
const ora = require('ora');
const version = require('./package.json').version;
const prompt = require('prompt-sync')({ sigint: true });

var newPort = 3000

module.exports = {
    errorMsg: '',

}