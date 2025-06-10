const args = process.argv.slice(2);
const path = require('path');
const copyfiles = require('copyfiles');

let source = undefined;
let destination = undefined;
let depth = 0;

const log = (message) => console.log(message);
const error = (message) => console.error(message);
const isListEmpty = (list) => !list || list.length <= 0;
const firstElement = (list) => list.length > 0 ? list[0] : null;

const getArgValue = (argLabel) => {
    const argLabelModified = `${argLabel}=`;
    const argList = args.filter(arg => arg.includes(argLabelModified))

    if (isListEmpty(argList)) {
        console.error(`Missing argument ${argLabel}.`);
        return undefined;
    }

    return firstElement(argList).replace(argLabelModified, "");
}

const getArgs = () => {
    if(isListEmpty(args)) {
        error("No source and destination where given");
    }
   
    source = getArgValue("--source").replaceAll("\\", "/");
    destination = getArgValue("--destination").replaceAll("\\", "/");
    depth = getArgValue("--depth");
    log(`Source: ${source}`);
    log(`Destination: ${destination}`);
    log(`Depth: ${depth}`);
}

getArgs();

log('Starting the file copy process...');

copyfiles([source, destination], { up: depth }, (error) => {
    if (error) {
        log(`Error: ${error.message}`);
    } else {
        log('File copy completed successfully!');
    }
});