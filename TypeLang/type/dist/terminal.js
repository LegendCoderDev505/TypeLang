"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminal_on = terminal_on;
const readline = __importStar(require("readline"));
const lexer_1 = require("./lexer");
const ast_tree_1 = require("./ast_tree");
const syntaxError_1 = require("./Errors/syntaxError"); // Import the custom SyntaxError class
function terminal_on() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'TypeLang> '
    });
    // Big logo created with '#' characters
    const logo = `
  ##########  ##      
      ##      ##      
      ##      ##      
      ##      ##      
      ##      ##      
      ##      ##      
      ##      ##########
  `;
    console.log(logo);
    console.log('Welcome to ALPHA-TypeLang REPL!');
    console.log('Type an expression (e.g. 10 + 20 * 3) or "exit" to quit.');
    rl.prompt();
    rl.on('line', (line) => {
        const trimmed = line.trim();
        if (line.trim() === "clear") {
            console.clear();
            rl.prompt();
            return;
        }
        if (line.trim() === "exit") {
            rl.close();
            return;
        }
        try {
            // Tokenize, convert infix to postfix, and evaluate
            const tokens = (0, lexer_1.tokenize_file)(trimmed); // Tokenizes input, returns Token[]
            const postfix = (0, lexer_1.infix_to_postfix)(tokens); // Converts infix to postfix, still Token[]
            const ast = (0, ast_tree_1.evaluate_tokens)(postfix); // Evaluates tokens into ASTNode
            const optimized = (0, ast_tree_1.optimize_ast)(ast); // Optimizes the AST directly
            console.log('Result:', optimized);
        }
        catch (err) {
            if (err instanceof syntaxError_1.SyntaxError) {
                // Handle the custom SyntaxError
                console.error('SyntaxError:', err.message);
            }
            else if (err instanceof Error) {
                // Handle general errors
                console.error('Error:', err.message);
            }
            else {
                // Handle unexpected errors
                console.error('Unexpected Error:', err);
            }
        }
        rl.prompt();
    });
}
