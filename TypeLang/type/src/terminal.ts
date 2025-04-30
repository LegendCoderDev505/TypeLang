import * as readline from 'readline';
import { tokenize_file, infix_to_postfix } from './lexer';
import { evaluate_tokens, optimize_ast } from './ast_tree';
import { SyntaxError } from './Errors/syntaxError';  // Import the custom SyntaxError class

export function terminal_on() {
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

  rl.on('line', (line: string) => {
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
      const tokens = tokenize_file(trimmed); // Tokenizes input, returns Token[]
      const postfix = infix_to_postfix(tokens); // Converts infix to postfix, still Token[]
      const ast = evaluate_tokens(postfix); // Evaluates tokens into ASTNode
      const optimized = optimize_ast(ast); // Optimizes the AST directly

        console.log('Result:', optimized);
      } catch (err: unknown) {
        if (err instanceof SyntaxError) {
          // Handle the custom SyntaxError
          console.error('SyntaxError:', err.message);
        } else if (err instanceof Error) {
          // Handle general errors
          console.error('Error:', err.message);
        } else {
          // Handle unexpected errors
          console.error('Unexpected Error:', err);
        }
      }

      rl.prompt();
  });
}