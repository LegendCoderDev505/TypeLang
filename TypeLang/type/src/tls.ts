#!/usr/bin/env node
import { terminal_on } from './terminal';
import { compile_file } from './index';
import { initProject } from './init';
import * as fs from "fs";

const args = process.argv.slice(2);

switch (args[0]) {
  case '--compile':
    const file = args[1];

    if (!file) {
        console.error("Error: No file specified.");
        process.exit(1);
    }

    if (!file.endsWith(".tl")) {
        console.error("Error: Only .tl (TypeLang) files are supported.");
        process.exit(1);
    }

    if (!fs.existsSync(file)) {
        console.error(`Error: File "${file}" not found.`);
        process.exit(1);
    }

    console.log(`Compiling: ${file}`);
    compile_file(file);
    break;

  case '--terminal':
    console.log("Starting TypeLang interactive terminal...");
    terminal_on();
    break;

  case '--init':
    console.log("Initializing new TypeLang project...");
    initProject();
    break;
  case '--version':
    const version = "Beta 1.2.8";
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
