// ---------------------------------------------
// AST Tree Generation and Evaluation with ! Operator
// ---------------------------------------------
// Variable storage structure to store variable names, values, and types
const variableStoreage: { [key: string]: { value: string | number | boolean, type: string } } = {};

export function evaluate(ast: ASTNode, context: Record<string, number>): number {
  if (ast.type === "Number") {
    return ast.value;
  } else if (ast.type === "Identifier") {
    if (context[ast.value] === undefined) {
      throw new Error(`Undefined variable: ${ast.value}`);
    }
    return context[ast.value];
  } else if (ast.type === "Operator") {
    const left = evaluate(ast.left, context);
    const right = evaluate(ast.right, context);
    switch (ast.value) {
      case "+": return left + right;
      case "-": return left - right;
      case "*": return left * right;
      case "/": return left / right;
      default:
        throw new Error(`Unknown operator: ${ast.value}`);
    }
  } else if (ast.type === "Assignment") {
    const varName = ast.left.value;
    const value = evaluate(ast.right, context);
    context[varName] = value;
    return value;
  } else if (ast.type === "Comparison") {
    const left = evaluate(ast.left, context);
    const right = evaluate(ast.right, context);
    switch (ast.value) {
      case "==": return left === right ? 1 : 0;
      case "!=": return left !== right ? 1 : 0;
      case ">": return left > right ? 1 : 0;
      case "<": return left < right ? 1 : 0;
      default:
        throw new Error(`Unknown comparison operator: ${ast.value}`);
    }
  } else {
    throw new Error(`Unknown AST node type: ${(ast as any).type}`);
  }
}


// This function prints the AST in a readable format
export function print_ast(ast: ASTNode): void {
  if (ast.type === "Number") {
    // You can remove logging here or replace it with any processing you need
    // If you want to process or return, you can store values elsewhere.
    // Example: return ast.value;
  } else if (ast.type === "Identifier") {
    // Handle the identifier (e.g., store or process it).
  } else if (ast.type === "Operator") {
    // Recursively process the left and right operands.
    print_ast(ast.left);
    print_ast(ast.right);
  } else if (ast.type === "Assignment") {
    // Just process left and right sides of the assignment.
    print_ast(ast.left);
    print_ast(ast.right);
  } else if (ast.type === "IfNot") {
    // If processing needed for IfNot condition.
    print_ast(ast.left);
    print_ast(ast.right);
  } else if (ast.type === "Comparison") {
    // Process Comparison condition.
    print_ast(ast.left);
    print_ast(ast.right);
  } else {
    // Unknown AST node type handling (maybe throw an error or something more appropriate).
    throw new Error(`Unknown AST node type: ${(ast as any).type}`);
  }
}


// This function evaluates the Abstract Syntax Tree (AST) recursively.
const evaluateAST = (node: ASTNode): boolean | number | string => {
  switch (node.type) {
    case 'Number':
      return Number(node.value);

    case 'Assignment': {
      const varName = (node.left as IdentifierNode).value;
      const value = evaluateAST(node.right);
      variableStoreage[varName] = {
        value: value, // Store the actual value
        type: typeof value
      };
      return value;
    }

    case 'Identifier': {
      const varName = node.value as string;
      if (variableStoreage[varName]) {
        return variableStoreage[varName].value;  // Retrieve the value of x (or any variable)
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

// Token interface represents the basic structure of a token
export interface Token {
  type: string;
  value: string;
}

// ASTNodeBase is the base structure for all AST nodes
export interface ASTNodeBase {
  type: string;
  value: string | number;
}

export interface NumberNode extends ASTNodeBase {
  type: "Number";
  value: string;
}

export interface IdentifierNode extends ASTNodeBase {
  type: "Identifier";
  value: string;
}

export interface OperatorNode extends ASTNodeBase {
  type: "Operator";
  value: string;
  left: ASTNode;
  right: ASTNode;
}

export interface AssignmentNode extends ASTNodeBase {
  type: "Assignment";
  value: string;
  left: ASTNode;
  right: ASTNode;
}

export interface IfNotNode extends ASTNodeBase {
  type: "IfNot";
  left: ASTNode;
  right: ASTNode;
}

export interface Comparison extends ASTNodeBase {
  type: "Comparison";
  left: ASTNode;
  right: ASTNode;
}

export type AST = NumberNode | IdentifierNode | OperatorNode | AssignmentNode | IfNotNode | Comparison;
export type ASTNode = AST;  // The ASTNode is a union of all possible node types.

/**
 * Evaluates a list of tokens into an AST structure.
 */
// export function evaluate_tokens(tokens: Token[]): ASTNode {
//   const stack: ASTNode[] = [];

//   for (const token of tokens) {
//     if (token.type === "Number") {
//       stack.push({ type: "Number", value: token.value });
//     } else if (token.type === "Identifier") {
//       stack.push({ type: "Identifier", value: token.value });
//     } else if (token.type === "Operator") {
//       const right = stack.pop();
//       const left = stack.pop();

//       if (!left || !right) throw new Error("Malformed expression");

//       if (token.value === "=") {
//         const variableName = (left as IdentifierNode).value;
//         const variableValue = evaluateAST(right);

//         variableStoreage[variableName] = {
//           value: variableValue,
//           type: typeof variableValue === 'number' ? 'number' : 'string',
//         };

//         stack.push({
//           type: "Assignment",
//           value: "=",
//           left,
//           right,
//         });
//       } else if (token.value === "!") {
//         stack.push({
//           type: "IfNot",
//           value: "!",
//           left,
//           right,
//         });
//       } else {
//         stack.push({
//           type: "Operator",
//           value: token.value,
//           left,
//           right,
//         });
//       }
//     }
//   }

//   if (stack.length !== 1) throw new Error("Invalid expression tree");

//   return stack[0];
// }

export function evaluate_tokens(tokens: Token[]): ASTNode {
  const outputStack: ASTNode[] = [];
  const operatorStack: Token[] = [];

  const precedence: { [key: string]: number } = {
    "!": 3,
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1,
    "==": 0,
    "=": -1 // Assignment has the lowest precedence
  };

  function applyOperator(opToken: Token) {
    const right = outputStack.pop();
    const left = outputStack.pop();

    if (!left || !right) throw new Error("Malformed expression");

    if (opToken.value === "=") {
      outputStack.push({
        type: "Assignment",
        value: "=",
        left,
        right,
      });
    } else if (opToken.value === "!") {
      outputStack.push({
        type: "IfNot",
        value: "!",
        left,
        right,
      });
    } else if (opToken.value === "==") {
      outputStack.push({
        type: "Comparison",
        value: "==",
        left,
        right,
      });
    } else {
      outputStack.push({
        type: "Operator",
        value: opToken.value,
        left,
        right,
      });
    }
  }

  for (const token of tokens) {
    if (token.type === "Number") {
      outputStack.push({ type: "Number", value: token.value });
    } else if (token.type === "Identifier") {
      outputStack.push({ type: "Identifier", value: token.value });
    } else if (token.type === "Operator") {
      while (
        operatorStack.length > 0 &&
        precedence[operatorStack[operatorStack.length - 1].value] >= precedence[token.value]
      ) {
        applyOperator(operatorStack.pop()!);
      }
      operatorStack.push(token);
    }
  }

  while (operatorStack.length > 0) {
    applyOperator(operatorStack.pop()!);
  }

  if (outputStack.length !== 1) {
    console.log("FINAL STACK:", outputStack);
    throw new Error("Invalid expression");
  }

  return outputStack[0];
}


/**
 * This function evaluates binary operators (like +, -, *, /) between two operands.
 */
export function evaluate_operator(op: string, l: number, r: number): number {
  switch (op) {
    case "+":
      return l + r;
    case "-":
      return l - r;
    case "*":
      return l * r;
    case "/":
      return l / r;
    case "==":
    case "===":
      return l === r ? 1 : 0;
    default:
      throw new Error(`Unknown operator: ${op}`);
  }
}

/**
 * This function optimizes the AST by evaluating constant expressions at compile time.
 */
export function optimize_ast(ast: ASTNode): ASTNode {
  if (ast.type === "Operator" || ast.type === "IfNot") {
    const left = optimize_ast(ast.left);
    const right = optimize_ast(ast.right);

    if (left.type === "Number" && right.type === "Number") {
      const l = parseFloat(left.value as string);
      const r = parseFloat(right.value as string);
      const value = ast.type === "IfNot"
        ? (l === r ? r : l)
        : evaluate_operator(ast.value, l, r);

      return { type: "Number", value: value.toString() };
    }

    return { ...ast, left, right };
  }

  return ast;
}