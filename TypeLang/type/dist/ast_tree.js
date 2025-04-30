"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print_ast = print_ast;
exports.evaluate_tokens = evaluate_tokens;
exports.evaluate_operator = evaluate_operator;
exports.binary_operator = binary_operator;
exports.ast_configure = ast_configure;
exports.optimize_ast = optimize_ast;
// ---------------------------------------------
// AST Tree Generation and Evaluation with ! Operator
// ---------------------------------------------
// Variable storage structure to store variable names, values, and types
const variableStoreage = {};
// This function evolves
// Print_AST
function print_ast(ast) {
    if (ast.type === "Number") {
        console.log(`Number: ${ast.value}`);
    }
    else if (ast.type === "Identifier") {
        console.log(`Identifier: ${ast.value}`);
    }
    else if (ast.type === "Operator") {
        console.log(`Operator: ${ast.value}`);
        print_ast(ast.left); // Recursively print the left operand.
        print_ast(ast.right); // Recursively print the right operand.
    }
    else if (ast.type === "Assignment") {
        console.log(`Assignment: ${ast.left} = ${ast.right}`);
    }
    else if (ast.type === "IfNot") {
        console.log(`IfNot: ${ast.left} ! ${ast.right}`);
    }
    else if (ast.type === "Comparison") {
        console.log(`Comparison: ${ast.left} ${ast.value} ${ast.right}`);
    }
    else {
        console.log(`Unknown AST node type: ${ast.type}`);
    }
}
// This function evaluates the Abstract Syntax Tree (AST) recursively. 
// Each AST node represents a part of an expression, such as numbers, operators, or comparisons.
const evaluateAST = (node) => {
    switch (node.type) {
        case 'Number':
            return Number(node.value);
        case 'Assignment': {
            const varName = node.left.value;
            const value = evaluateAST(node.right);
            variableStoreage[varName] = {
                value: value, // Store the actual value
                type: typeof value
            };
            return value;
        }
        case 'Identifier': {
            const varName = node.value;
            if (variableStoreage[varName]) {
                return variableStoreage[varName].value; // Retrieve the value of x (or any variable)
            }
            throw new Error(`Variable ${varName} is not defined`);
        }
        case 'Operator': {
            const left = evaluateAST(node.left);
            const right = evaluateAST(node.right);
            if (typeof left === 'number' && typeof right === 'number') {
                return evaluate_operator(node.value, left, right);
            }
            throw new Error(`Invalid operands for operator ${node.value}`);
        }
        case 'Comparison': {
            const left = evaluateAST(node.left);
            const right = evaluateAST(node.right);
            return left === right ? 'ifboolean: 1' : 'ifboolean: 0';
        }
        case 'IfNot': {
            const condition = evaluateAST(node.left);
            if (condition === 'ifboolean: 1' || condition === true || condition === 1) {
                return ''; // If condition is true, skip right side
            }
            return evaluateAST(node.right);
        }
        default:
            return 'undefined';
    }
};
/**
 * Evaluates a list of tokens into an AST structure.
 *
 * @param tokens - Array of Token objects, where each token has a type (e.g., 'Number', 'Operator') and value.
 * @returns ASTNode - The root node of the AST.
 */
function evaluate_tokens(tokens) {
    const stack = [];
    for (const token of tokens) {
        if (token.type === "Number") {
            stack.push({ type: "Number", value: token.value });
        }
        else if (token.type === "Identifier") {
            stack.push({ type: "Identifier", value: token.value });
        }
        else if (token.type === "Operator") {
            const right = stack.pop();
            const left = stack.pop();
            if (!left || !right)
                throw new Error("Malformed expression");
            if (token.value === "=") {
                // Handle assignment and store the variable in variableStoreage
                const variableName = left.value;
                const variableValue = evaluateAST(right);
                // Store the variable's value and type in variableStoreage
                variableStoreage[variableName] = {
                    value: variableValue,
                    type: typeof variableValue === 'number' ? 'number' : 'string', // For simplicity, we're using basic types
                };
                stack.push({
                    type: "Assignment",
                    value: "=",
                    left,
                    right,
                });
            }
            else if (token.value === "!") {
                stack.push({
                    type: "IfNot",
                    value: "!",
                    left,
                    right,
                });
            }
            else {
                stack.push({
                    type: "Operator",
                    value: token.value,
                    left,
                    right,
                });
            }
        }
    }
    if (stack.length !== 1)
        throw new Error("Invalid expression tree");
    return stack[0];
}
/**
 * This function evaluates binary operators (like +, -, *, /) between two operands.
 *
 * @param op - The operator to evaluate (e.g., "+", "-", "*", "/").
 * @param l - The left operand (a number).
 * @param r - The right operand (a number).
 * @returns number - The result of applying the operator to the operands.
 */
function evaluate_operator(op, l, r) {
    switch (op) {
        case "+":
            return l + r; // returns a number
        case "-":
            return l - r; // returns a number
        case "*":
            return l * r; // returns a number
        case "/":
            return l / r; // returns a number
        case "==":
        case "===":
            return l === r ? 1 : 0; // return 1 for true, 0 for false (both numbers)
        default:
            throw new Error(`Unknown operator: ${op}`); // Handle unknown operators
    }
}
/**
 * This function handles binary operator logic for operators like +, -, *, /, ==, etc.
 *
 * @param op - The operator to evaluate (e.g., "+", "-", "*", "/").
 * @param l - The left operand (a number).
 * @param r - The right operand (a number).
 * @returns number - The result of the operation.
 */
function binary_operator(op, l, r) {
    return evaluate_operator(op, l, r); // Simply calls evaluate_operator and returns the result.
}
/**
 * This function configures the AST based on the provided tokens, ensuring the tree is valid.
 * It uses a stack to handle operator precedence and parentheses.
 *
 * @param tokens - Array of tokens that need to be converted into an AST.
 * @returns ASTNode - The configured AST.
 */
function ast_configure(tokens) {
    const stack = [];
    const operatorStack = []; // Stack to hold operators.
    // Helper function to handle operator precedence.
    const precedence = (operator) => {
        if (operator === '=' || operator === ',')
            return 1; // Lowest precedence for assignment and commas.
        if (operator === '!' || operator === '==' || operator === '===')
            return 2; // Middle precedence for logical and comparison operators.
        return 0; // Default precedence (for operators like +, -, *, etc.)
    };
    // Helper function to apply an operator and form the corresponding AST nodes.
    const applyOperator = () => {
        const operator = operatorStack.pop();
        const right = stack.pop();
        const left = stack.pop();
        // Handle different types of operators.
        if (operator === '=') {
            stack.push({
                type: 'Assignment',
                value: operator,
                left,
                right
            });
        }
        else if (operator === '==' || operator === '!=' || operator === '>' || operator === '<') {
            stack.push({
                type: 'Comparison',
                value: operator,
                left,
                right
            });
        }
        else {
            stack.push({
                type: 'Operator',
                value: operator,
                left,
                right
            });
        }
    };
    // Main loop to process the tokens and create the AST.
    for (const token of tokens) {
        if (token.type === 'Number') {
            stack.push({ type: 'Number', value: token.value });
        }
        else if (token.type === 'Identifier') {
            stack.push({ type: 'Identifier', value: token.value });
        }
        else if (token.type === 'Operator') {
            // Apply operators with higher precedence first.
            while (operatorStack.length > 0 &&
                precedence(operatorStack[operatorStack.length - 1]) >= precedence(token.value)) {
                applyOperator(); // Apply any operators with higher or equal precedence.
            }
            operatorStack.push(token.value); // Push the current operator onto the stack.
        }
    }
    // Apply any remaining operators after processing all tokens.
    while (operatorStack.length > 0) {
        applyOperator();
    }
    if (stack.length !== 1)
        throw new Error('Invalid expression tree');
    return stack[0]; // Return the root node of the AST.
}
/**
 * Optimizes the AST by evaluating constant expressions at compile time.
 * This function traverses the AST, simplifying constant operations.
 *
 * @param ast - The root node of the AST.
 * @returns ASTNode - The optimized AST.
 */
function optimize_ast(ast) {
    if (ast.type === "Operator" || ast.type === "IfNot") {
        const left = optimize_ast(ast.left);
        const right = optimize_ast(ast.right);
        if (left.type === "Identifier") {
            const varName = left.value;
            if (variableStoreage[varName]) {
                left.value = String(variableStoreage[varName].value); // Retrieve the variable value
            }
        }
        if (right.type === "Identifier") {
            const varName = right.value;
            if (variableStoreage[varName]) {
                right.value = String(variableStoreage[varName].value); // Retrieve the variable value
            }
        }
        if (left.type === "Number" && right.type === "Number") {
            const l = parseFloat(left.value);
            const r = parseFloat(right.value);
            const value = ast.type === "IfNot"
                ? (l === r ? r : l)
                : evaluate_operator(ast.value, l, r);
            return { type: "Number", value: value.toString() };
        }
        return { ...ast, left, right };
    }
    return ast;
}
