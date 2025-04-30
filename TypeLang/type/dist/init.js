"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initProject = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createFile = (filePath, content) => {
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath}`);
    }
};
const createFolder = (folderPath) => {
    if (!fs_1.default.existsSync(folderPath)) {
        fs_1.default.mkdirSync(folderPath, { recursive: true });
        console.log(`Created folder: ${folderPath}`);
    }
};
const initProject = () => {
    //   const rootDir = path.join(process.cwd(), 'typelang');
    //   // Create directories
    //   const dirs = ['src', 'conf', 'examples', 'tests'];
    //   dirs.forEach((dir) => {
    //     createFolder(path.join(rootDir, dir));
    //   });
    //   // Create a simple TypeLang source file example
    //   const exampleScript = `
    // let x = 50
    // x + 10
    //   `;
    //   createFile(path.join(rootDir, 'examples', 'example.script'), exampleScript);
    //   // Create TypeLang configuration file
    //   const configContent = `
    // {
    //   "version": "0.1.0",
    //   "name": "TypeLang",
    //   "author": "Your Name",
    //   "license": "ISC"
    // }
    //   `;
    //   createFile(path.join(rootDir, 'conf', 'type_config.json'), configContent);
    //   // Create basic TypeScript entry point
    //   const indexContent = `
    // console.log("Welcome to TypeLang!");
    //   `;
    //   createFile(path.join(rootDir, 'src', 'index.ts'), indexContent);
    //   // Create basic lexer
    //   const lexerContent = `
    // export function tokenize(input: string) {
    //   // Lexer logic here
    //   return [];
    // }
    //   `;
    //   createFile(path.join(rootDir, 'src', 'lexer.ts'), lexerContent);
    //   // Create basic parser
    //   const parserContent = `
    // export function parse(tokens: any[]) {
    //   // Parser logic here
    //   return [];
    // }
    //   `;
    //   createFile(path.join(rootDir, 'src', 'parser.ts'), parserContent);
    //   // Create basic interpreter
    //   const interpreterContent = `
    // export function interpret(ast: any[]) {
    //   // Interpreter logic here
    //   console.log(ast);
    // }
    //   `;
    //   createFile(path.join(rootDir, 'src', 'interpreter.ts'), interpreterContent);
    //   // Create basic test file
    //   const testContent = `
    // import { tokenize } from './src/lexer';
    // import { parse } from './src/parser';
    // import { interpret } from './src/interpreter';
    // const script = 'let x = 10';
    // const tokens = tokenize(script);
    // const ast = parse(tokens);
    // interpret(ast);
    //   `;
    //   createFile(path.join(rootDir, 'tests', 'basic_tests.ts'), testContent);
    //   // Create package.json
    //   const packageJsonContent = `
    // {
    //   "name": "typelang",
    //   "version": "0.1.0",
    //   "main": "src/index.ts",
    //   "scripts": {
    //     "start": "ts-node src/index.ts",
    //     "test": "tsc && node dist/index.js"
    //   },
    //   "dependencies": {},
    //   "devDependencies": {
    //     "typescript": "^4.0.0",
    //     "ts-node": "^9.0.0"
    //   },
    //   "license": "ISC"
    // }
    //   `;
    //   createFile(path.join(rootDir, 'package.json'), packageJsonContent);
    //   // Create tsconfig.json
    //   const tsconfigContent = `
    // {
    //   "compilerOptions": {
    //     "target": "ES6",
    //     "module": "commonjs",
    //     "strict": true,
    //     "esModuleInterop": true,
    //     "skipLibCheck": true,
    //     "forceConsistentCasingInFileNames": true
    //   },
    //   "include": ["src/**/*"]
    // }
    //   `;
    //   createFile(path.join(rootDir, 'tsconfig.json'), tsconfigContent);
    //   // Create README.md with properly escaped backticks
    //   const readmeContent = `
    // # TypeLang Project
    // Welcome to TypeLang! This is a simple language project.
    // ## Getting Started
    // 1. Install dependencies:
    //     \`\`\`
    //     npm install
    //     \`\`
    // 2. To run:
    //     \`\`\`
    //     npm start
    //     \`\`
    // 3. To compile:
    //     \`\`\`
    //     npm run test
    //     \`\`
    // ## Project Structure
    // - \`/src\`: Source code for TypeLang interpreter/compiler
    // - \`/conf\`: Configuration files
    // - \`/examples\`: Example TypeLang script files
    // - \`/tests\`: Tests for TypeLang language
    //   `;
    //   createFile(path.join(rootDir, 'README.md'), readmeContent);
    const rootDir = path_1.default.join(process.cwd(), 'app');
    const dirs = ["src", "tools"];
    dirs.forEach((dir) => {
        createFolder(path_1.default.join(rootDir, dir));
    });
    const exampleScript = `
let x = 10
x + 10 == 20
`;
    const configContent = `
{
  "name": "typelang",
  "version": "0.1.5",
  "description": "The fast Calculator Alpha Version with Basic and Haskell functions",
  "scripts": {
    "test": "tls "
  },
  "keywords": [
    "let"
  ],
  "author": "Legend Coder Dev 505",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/LegendCoderDev505/Type-and-Writer-Lang/issues"
  },
  "homepage": "https://github.com/LegendCoderDev505/Type-and-Writer-Lang/tree/main#readme"
}

`;
    createFile(path_1.default.join(rootDir, 'src', 'main.script'), exampleScript);
    createFile(path_1.default.join(rootDir, 'src', 'config.json'), configContent);
    const contentTools = `Patch update until Beta 0.2.6`;
    createFile(path_1.default.join(rootDir, 'tools', 'patcher.tls'), contentTools);
    console.log('TypeLang project initialized successfully!');
};
exports.initProject = initProject;
