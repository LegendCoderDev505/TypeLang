"use strict";
// import * as readline from 'readline';
// import { compile_line } from './index'; // Importing the compile_line function from index
// import { SyntaxError } from './Errors/syntaxError';  // Import the custom SyntaxError class
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
const readline = __importStar(require("readline"));
const syntaxError_1 = require("./Errors/syntaxError"); // Import the custom SyntaxError class
// Simple in-memory storage for variables and their values
const variables = {};
// Helper function to evaluate expressions (e.g., "y + 10")
function evaluateExpression(expression) {
    // Tokenize by word boundaries and operators
    const tokens = expression.match(/\b\w+\b|[+\-*/()]/g);
    if (!tokens) {
        throw new syntaxError_1.SyntaxError("Invalid expression.");
    }
    // Replace variables with their values
    const resolved = tokens.map(token => {
        if (/^[a-zA-Z_]\w*$/.test(token)) {
            if (variables.hasOwnProperty(token)) {
                return variables[token];
            }
            else {
                throw new syntaxError_1.SyntaxError(`Undefined variable: ${token}`);
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
            throw new syntaxError_1.SyntaxError('Expression must evaluate to a number.');
        }
        return result;
    }
    catch {
        throw new syntaxError_1.SyntaxError('Invalid expression.');
    }
}
// Function to handle assignments (e.g., let x = 10)
function handleAssignment(input) {
    let tokens = input.split(' ');
    let identifier = tokens[1]; // The variable name (e.g., 'y')
    let value = parseInt(tokens[3], 10); // The value (e.g., '10')
    // Store the value in the variables object
    variables[identifier] = value;
}
// Function to handle expressions and assignments in the REPL
function handleReplInput(input) {
    if (input.startsWith('let')) {
        // It's an assignment
        handleAssignment(input);
    }
    else {
        // Otherwise, it's an expression
        try {
            let result = evaluateExpression(input);
            console.log(result);
        }
        catch (error) {
            if (error instanceof syntaxError_1.SyntaxError) {
                console.error('Syntax Error:', error.message);
            }
            else if (error instanceof Error) {
                console.error('Error:', error.message);
            }
            else {
                console.error('Unexpected Error:', error);
            }
        }
    }
}
function terminal_on() {
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
    const commands = []; // Array to store commands
    rl.prompt();
    rl.on('line', (line) => {
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
            }
            catch (err) {
                if (err instanceof syntaxError_1.SyntaxError) {
                    console.error('Syntax Error:', err.message); // Handle custom SyntaxError
                }
                else if (err instanceof Error) {
                    console.error('Error:', err.message); // Handle other types of errors
                }
                else {
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
