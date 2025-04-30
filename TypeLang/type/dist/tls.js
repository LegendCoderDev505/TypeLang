#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const terminal_1 = require("./terminal");
const index_1 = require("./index");
const init_1 = require("./init");
const args = process.argv.slice(2);
switch (args[0]) {
    case '--compile':
        const file = args[1];
        if (!file) {
            console.error("Error: No file specified.");
        }
        else {
            console.log(`Compiling: ${file}`);
            (0, index_1.main)(file);
        }
        break;
    case '--terminal':
        console.log("Starting TypeLang interactive terminal...");
        (0, terminal_1.terminal_on)();
        break;
    case '--init':
        console.log("Initializing new TypeLang project...");
        (0, init_1.initProject)();
        break;
    case '--version':
        const version = "Alpha 0.1.5";
        const message = "Patch Version : ";
        console.log(message, version + "\n");
        break;
    default:
        console.log("Unknown command.");
        console.log("Usage:");
        console.log("  --compile <file>     Compile a TypeLang source file");
        console.log("  --terminal           Start TypeLang interactive terminal");
        console.log("  --init               Initialize a new TypeLang project");
        console.log("  --version            Shows version of TypeLang");
}
