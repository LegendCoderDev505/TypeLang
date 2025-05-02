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
exports.read_file = read_file;
exports.open_file = open_file;
exports.lexing = lexing;
exports.infix_to_postfix = infix_to_postfix;
exports.precedence = precedence;
exports.tokenize_file = tokenize_file;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const syntaxError_1 = require("./Errors/syntaxError");
// === Component: read_file ===
function read_file(fullPath) {
    // read the file content synchronously
    return fs.readFileSync(fullPath, 'utf-8');
}
// === Component: open_file ===
function open_file(filePath) {
    // resolves and return full file path
    return path.resolve(filePath);
}
// === Component: lexing ===
// === Component: lexing ===
function lexing(code) {
    const tokens = [];
    let i = 0;
    while (i < code.length) {
        const char = code[i];
        // Skip whitespace
        if (/\s/.test(char)) {
            i++;
            continue;
        }
        // Multi-character operators for comparison
        if (code.slice(i, i + 3) === "===") {
            tokens.push({
                type: "Operator",
                value: "==",
                meta: { type: "boolean", fromComparison: true }
            });
            i += 3;
            continue;
        }
        if (code.slice(i, i + 2) === "==") {
            tokens.push({
                type: "Operator",
                value: "==",
                meta: { type: "boolean", fromComparison: true }
            });
            i += 2;
            continue;
        }
        if (code.slice(i, i + 2) === "!=") {
            tokens.push({
                type: "Operator",
                value: "!=",
                meta: { type: "boolean", fromComparison: true }
            });
            i += 2;
            continue;
        }
        // Single-character operators including !
        if ("+-*/=!".includes(char)) {
            tokens.push({
                type: "Operator",
                value: char,
                meta: { type: "operator" }
            });
            i++;
            continue;
        }
        // Parentheses
        if (char === "(" || char === ")") {
            tokens.push({ type: "Paren", value: char });
            i++;
            continue;
        }
        // Keywords like let, const, inputtab
        if (/let|const|inp/.test(code.substring(i, i + 3))) {
            const keyword = code.substring(i, i + 3);
            tokens.push({ type: 'Keyword', value: keyword });
            i += keyword.length;
            continue;
        }
        // Numbers
        if (/\d/.test(char)) {
            let num = '';
            while (i < code.length && /\d/.test(code[i])) {
                num += code[i++];
            }
            tokens.push({ type: 'Number', value: Number(num).toString() }); // keep value as string for consistency
            continue;
        }
        // Identifiers
        if (/[a-zA-Z_]/.test(char)) {
            let ident = '';
            while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
                ident += code[i++];
            }
            tokens.push({ type: 'Identifier', value: ident });
            continue;
        }
        throw new Error(`Unknown character: '${char}'`);
    }
    return tokens;
}
// === Component: infix_to_postfix ===
// This function converts infix tokens to postfix tokens (Reverse Polish Notation)
function infix_to_postfix(tokens) {
    const output = [];
    const operators = [];
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '=': 0, // Assignment has lowest precedence
    };
    for (const token of tokens) {
        switch (token.type) {
            case 'Number':
            case 'Identifier':
                // Directly add numbers and identifiers to output
                output.push(token);
                break;
            case 'Operator':
                if (token.value === '=') {
                    // Handle assignment
                    // Pop the operator before assigning
                    while (operators.length > 0 && precedence[operators[operators.length - 1].value] > precedence[token.value]) {
                        output.push(operators.pop());
                    }
                    operators.push(token); // Push the assignment operator onto the stack
                }
                else {
                    // For other operators, handle precedence
                    while (operators.length > 0 && precedence[operators[operators.length - 1].value] >= precedence[token.value]) {
                        output.push(operators.pop());
                    }
                    operators.push(token);
                }
                break;
        }
    }
    // Pop remaining operators from the stack to the output
    while (operators.length > 0) {
        output.push(operators.pop());
    }
    return output;
}
// === Component: precedence ===
function precedence(operator) {
    if (operator.value === '=')
        return 0; // Assignment operator should have lowest precedence
    if (operator.value === '+' || operator.value === '-') {
        return 1;
    }
    else if (operator.value === '*' || operator.value === '/') {
        return 2;
    }
    return 0; // For parens or undefined operator
}
// === Component: tokenize_file ===
function tokenize_file(code) {
    // Tokenize the input code using lexing function
    const tokens = lexing(code);
    (0, syntaxError_1.checkForSyntaxErrors)(tokens);
    return lexing(code);
}
// const filePath = 'test.script';  // Assuming your script file is named 'test.script'
// const fullPath = open_file(filePath);
// const code = read_file(fullPath);
// const tokens = tokenize_file(code);
// // Convert tokens from Infix to Postfix (RPN)
// const postfixTokens = infix_to_postfix(tokens);
// // Output Postfix Tokens
// console.log('Postfix Tokens:', postfixTokens);
