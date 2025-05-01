// import * as readline from 'readline';
// import { compile_line } from './index'; // Importing the compile_line function from index
// import { SyntaxError } from './Errors/syntaxError';  // Import the custom SyntaxError class

// // Simple in-memory storage for variables and their values
// const variables: Record<string, any> = {};

// export function terminal_on() {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     prompt: 'TypeLang> '
//   });

//   const logo = `
//   ##########  ##      
//       ##      ##      
//       ##      ##      
//       ##      ##      
//       ##      ##      
//       ##      ##      
//       ##      ##########
//   `;

//   console.log(logo);
//   console.log('Welcome to ALPHA-TypeLang REPL!');
//   console.log('Type expressions and then type "run" to execute all.');
//   console.log('Type "clear" to clear the screen, and "exit" to exit.');

//   const commands: string[] = []; // Array to store commands

//   rl.prompt();

//   rl.on('line', (line: string) => {
//     const trimmed = line.trim();

//     if (trimmed === "clear") {
//       console.clear();
//       rl.prompt();
//       return;
//     }
    
//     if (trimmed === "exit") {
//       rl.close();
//       return;
//     }

//     if (trimmed === "run") {
//       // When 'run' is entered, process all commands
//       console.log("Running all commands...");
//       try {
//         // Call the compile_line function to process the collected commands
//         compile_line(commands);
//         // Clear the stored commands after running them
//         commands.length = 0;
//       } catch (err: unknown) {
//         if (err instanceof SyntaxError) {
//           console.error('Syntax Error:', err.message); // Handle custom SyntaxError
//         } else if (err instanceof Error) {
//           console.error('Error:', err.message); // Handle other types of errors
//         } else {
//           console.error('Unexpected Error:', err);
//         }
//       }
      
//       rl.prompt();
//       return;
//     }

//     // Store the command for future execution
//     commands.push(trimmed);
//     console.log(`Command stored: "${trimmed}"`);
//     rl.prompt();
//   });
// }

// if (require.main === module) {
//   terminal_on(); // Only run if this file is executed directly
// }


import * as readline from 'readline';
import { compile_line } from './index'; // Importing the compile_line function from index
import { SyntaxError } from './Errors/syntaxError';  // Import the custom SyntaxError class

// Simple in-memory storage for variables and their values
const variables: Record<string, any> = {};

// Helper function to evaluate expressions (e.g., "y + 10")
function evaluateExpression(expression: string): number {
  // Tokenize by word boundaries and operators
  const tokens = expression.match(/\b\w+\b|[+\-*/()]/g);

  if (!tokens) {
    throw new SyntaxError("Invalid expression.");
  }

  // Replace variables with their values
  const resolved = tokens.map(token => {
    if (/^[a-zA-Z_]\w*$/.test(token)) {
      if (variables.hasOwnProperty(token)) {
        return variables[token];
      } else {
        throw new SyntaxError(`Undefined variable: ${token}`);
      }
    }
    return token; // numbers and operators
  });

  // Join into string
  const computable = resolved.join(' ');

  // Evaluate safely
  try {
    const result = Function(`"use strict"; return (${computable})`)();
    if (typeof result !== 'number') {
      throw new SyntaxError('Expression must evaluate to a number.');
    }
    return result;
  } catch {
    throw new SyntaxError('Invalid expression.');
  }
}

// Function to handle assignments (e.g., let x = 10)
function handleAssignment(input: string): void {
  let tokens = input.split(' ');
  let identifier = tokens[1]; // The variable name (e.g., 'y')
  let value = parseInt(tokens[3], 10); // The value (e.g., '10')

  // Store the value in the variables object
  variables[identifier] = value;
}

// Function to handle expressions and assignments in the REPL
function handleReplInput(input: string): void {
  if (input.startsWith('let')) {
    // It's an assignment
    handleAssignment(input);
  } else {
    // Otherwise, it's an expression
    try {
      let result = evaluateExpression(input);
      console.log(result);
    } catch (error: unknown) {
      if (error instanceof SyntaxError) {
        console.error('Syntax Error:', error.message);
      } else if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('Unexpected Error:', error);
      }
    }
  }
}

export function terminal_on() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'TypeLang> '
  });

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
  console.log('Type expressions and then type "run" to execute all.');
  console.log('Type "clear" to clear the screen, and "exit" to exit.');

  const commands: string[] = []; // Array to store commands

  rl.prompt();

  rl.on('line', (line: string) => {
    const trimmed = line.trim();

    if (trimmed === "clear") {
      console.clear();
      rl.prompt();
      return;
    }
    
    if (trimmed === "exit") {
      rl.close();
      return;
    }

    if (trimmed === "run") {
      // When 'run' is entered, process all commands
      console.log("Running all commands...");
      try {
        // Call the compile_line function to process the collected commands
        commands.forEach(command => handleReplInput(command));
        // Clear the stored commands after running them
        commands.length = 0;
      // Handle the error properly by checking if it's an instance of Error
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        console.error('Syntax Error:', err.message); // Handle custom SyntaxError
      } else if (err instanceof Error) {
        console.error('Error:', err.message); // Handle other types of errors
      } else {
        console.error('Unexpected Error:', err); // Fallback for unknown types
      }
    }

      
      rl.prompt();
      return;
    }

    // Store the command for future execution
    commands.push(trimmed);
    rl.prompt();
  });
}

if (require.main === module) {
  terminal_on(); // Only run if this file is executed directly
}
