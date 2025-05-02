import {
  evaluate_tokens,
  print_ast,
  optimize_ast,
  Token,
  evaluate
} from './ast_tree';

import {
  open_file,
  read_file,
  tokenize_file,
  infix_to_postfix
} from './lexer';



// Global symbol table (context)
const context: Record<string, number> = {};

function process_code(content: string): void {
  if (content.trim() === '') return; // Skip empty lines

  // console.log(`\nEvaluating line: ${content}`);

  try {
    const tokens = tokenize_file(content.trim());         // Tokenize input
    const postfix = infix_to_postfix(tokens);             // Convert to postfix
    const ast = evaluate_tokens(postfix);                 // Generate AST
    const optimized = optimize_ast(ast);                  // Optimize AST
    // console.log(ast); // debug
    print_ast(optimized);                                 // Print AST tree

    const result = evaluate(optimized, context);      // Evaluate with context

    if (optimized.type !== "Assignment") {
      console.log(`Result: ${result}`);
    }

  } catch (err: unknown) {
    handle_error(err);
  }
}

// Function to handle errors in the code
function handle_error(err: unknown): void {
  if (err instanceof SyntaxError) {
    console.error('Syntax Error:', err.message);
  } else if (err instanceof Error) {
    console.error('Error:', err.message);
  } else {
    console.error('Unexpected Error:', err);
  }
}

// Main function to compile code from a file
export function compile_file(file: string): void {
  const fullPath = open_file(file);
  const code = read_file(fullPath);

  const lines = code.trim().split(/\r?\n/);
  lines.forEach(process_code); // Process each line in the file
}

// Function to compile individual commands (used in REPL or command-line context)
export function compile_line(commands: string[]): void {
  commands.forEach(process_code); // Process each command in the list
}

