// Errors/syntaxError.ts
import { Token } from '../lexer'
export class SyntaxError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SyntaxError'; // Custom name for our SyntaxError
    }
}

export function checkForSyntaxErrors(tokens: Token[]): void {
    // Example: Check for a missing '+' between numbers
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === 'Number' && tokens[i + 1]?.type === 'Number') {
            throw new SyntaxError(`No operator between numbers at ${tokens[i].value} and ${tokens[i + 1].value}`);
        }
    }
}
