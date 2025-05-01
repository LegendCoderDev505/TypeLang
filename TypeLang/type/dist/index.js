"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile_file = compile_file;
exports.compile_line = compile_line;
const ast_tree_1 = require("./ast_tree");
const lexer_1 = require("./lexer");
// Global symbol table (context)
const context = {};
function process_code(content) {
    if (content.trim() === '')
        return; // Skip empty lines
    // console.log(`\nEvaluating line: ${content}`);
    try {
        const tokens = (0, lexer_1.tokenize_file)(content.trim()); // Tokenize input
        const postfix = (0, lexer_1.infix_to_postfix)(tokens); // Convert to postfix
        const ast = (0, ast_tree_1.evaluate_tokens)(postfix); // Generate AST
        const optimized = (0, ast_tree_1.optimize_ast)(ast); // Optimize AST
        (0, ast_tree_1.print_ast)(optimized); // Print AST tree
        const result = (0, ast_tree_1.evaluate)(optimized, context); // Evaluate with context
        if (optimized.type !== "Assignment") {
            console.log(`Result: ${result}`);
        }
    }
    catch (err) {
        handle_error(err);
    }
}
// Function to handle errors in the code
function handle_error(err) {
    if (err instanceof SyntaxError) {
        console.error('Syntax Error:', err.message);
    }
    else if (err instanceof Error) {
        console.error('Error:', err.message);
    }
    else {
        console.error('Unexpected Error:', err);
    }
}
// Main function to compile code from a file
function compile_file(file) {
    const fullPath = (0, lexer_1.open_file)(file);
    const code = (0, lexer_1.read_file)(fullPath);
    const lines = code.trim().split(/\r?\n/);
    lines.forEach(process_code); // Process each line in the file
}
// Function to compile individual commands (used in REPL or command-line context)
function compile_line(commands) {
    commands.forEach(process_code); // Process each command in the list
}
