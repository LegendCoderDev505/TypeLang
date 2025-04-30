import { SyntaxError } from './Errors/syntaxError';

function parseExpression(expression: string): void {
  // Example of simple syntax check for consecutive numbers without an operator
  const regex = /\d+\s+\d+/g; // This regex will match two numbers with space in between (invalid case)

  if (regex.test(expression)) {
    throw new SyntaxError(`SyntaxError: No '+' at ${expression}`);
  }

  // Further parsing logic here...
}

function main() {
  const input = "10 10 + 10"; // This would trigger the syntax error
  try {
    parseExpression(input);
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(err.message); // Display the custom error message
    } else {
      console.error("An unexpected error occurred.");
    }
  }
}

main();
