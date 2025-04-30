"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const ast_tree_1 = require("./ast_tree");
const lexer_1 = require("./lexer");
// Main script execution
function main(file) {
    const filePath = file;
    const fullPath = (0, lexer_1.open_file)(filePath);
    const code = (0, lexer_1.read_file)(fullPath);
    const lines = code.trim().split(/\r?\n/);
    for (const line of lines) {
        if (line.trim() === '')
            continue; // skip empty lines
        console.log(`\nEvaluating line: ${line}`);
        try {
            // Use `line.trim()` directly in the function
            const tokens = (0, lexer_1.tokenize_file)(line.trim()); // This will now check for syntax errors
            const postfix = (0, lexer_1.infix_to_postfix)(tokens);
            const ast = (0, ast_tree_1.evaluate_tokens)(postfix); // No need to call ast_configure anymore
            const optimized = (0, ast_tree_1.optimize_ast)(ast); // Using optimize_ast directly
            (0, ast_tree_1.print_ast)(optimized);
        }
        catch (err) {
            if (err instanceof SyntaxError) {
                console.error('Syntax Error:', err.message); // Handle custom SyntaxError
            }
            else if (err instanceof Error) {
                console.error('Error:', err.message); // Handle other types of errors
            }
            else {
                console.error('Unexpected Error:', err);
            }
        }
    }
}
