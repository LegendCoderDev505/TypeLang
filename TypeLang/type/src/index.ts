import {
  evaluate_tokens,
  print_ast,
  Token,
  optimize_ast,
  ast_configure
} from './ast_tree';

import {
  open_file,
  read_file,
  tokenize_file,
  infix_to_postfix
} from './lexer';

// Main script execution
export function main(file: string): void {
  const filePath = file;
  const fullPath = open_file(filePath);
  const code = read_file(fullPath);

  const lines = code.trim().split(/\r?\n/);

  for (const line of lines) {
    if (line.trim() === '') continue; // skip empty lines

    console.log(`\nEvaluating line: ${line}`);
    
    try {
      // Use `line.trim()` directly in the function
      const tokens = tokenize_file(line.trim()); // This will now check for syntax errors
      const postfix = infix_to_postfix(tokens);
      const ast = evaluate_tokens(postfix);  // No need to call ast_configure anymore
      const optimized = optimize_ast(ast);  // Using optimize_ast directly
      print_ast(optimized);
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
          console.error('Syntax Error:', err.message); // Handle custom SyntaxError
      } else if (err instanceof Error) {
          console.error('Error:', err.message); // Handle other types of errors
      } else {
          console.error('Unexpected Error:', err);
      }
    }
  }
}
