"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateCallExpression = exports.evaluateObjectExpression = exports.evaluateAssignmentExpression = exports.evaluate = void 0;
const values_1 = require("./values");
const AST_1 = require("../AST");
const environment_1 = __importDefault(require("./environment"));
function evaluate(astNode, env) {
    switch (astNode.type) {
        case AST_1.AstNodeType.NumericLiteral:
            return {
                type: values_1.ValueNodeType.NumericLiteral,
                value: astNode.value,
            };
        case AST_1.AstNodeType.NullLiteral:
            return {
                type: values_1.ValueNodeType.NullLiteral,
                value: astNode.value,
            };
        case AST_1.AstNodeType.BinaryExpression:
            return evaluateBinaryExpression(astNode, env);
        case AST_1.AstNodeType.Identifier:
            return evaluateIdentifier(astNode, env);
        case AST_1.AstNodeType.VariableDeclaration:
            return evaluateVariableDeclaration(astNode, env);
        case AST_1.AstNodeType.FunctionDeclaration:
            return evaluateFunctionDeclaration(astNode, env);
        case AST_1.AstNodeType.Program:
            return evaluateProgram(astNode, env);
        case AST_1.AstNodeType.AssignmentExpression:
            return evaluateAssignmentExpression(astNode, env);
        case AST_1.AstNodeType.ObjectLiteral:
            return evaluateObjectExpression(astNode, env);
        case AST_1.AstNodeType.CallExpression:
            return evaluateCallExpression(astNode, env);
        default:
            throw `can not interpret this node\n ${JSON.stringify(astNode, null, 2)} `;
    }
}
exports.evaluate = evaluate;
function evaluateIdentifier(identifier, env) {
    const value = env.lookup(identifier.name);
    return value;
}
function evaluateNumericBinExp(left, right, operator) {
    let result = 0;
    switch (operator) {
        case '+':
            result = left.value + right.value;
            break;
        case '-':
            result = left.value - right.value;
            break;
        case "*":
            result = left.value * right.value;
            break;
        case "/":
            result = left.value / right.value;
            if (right.value == 0)
                throw 'division by zero is impossible';
            break;
        case "%":
            result = left.value % right.value;
            break;
    }
    return { type: values_1.ValueNodeType.NumericLiteral, value: result };
}
function evaluateBinaryExpression(operation, env) {
    const left = evaluate(operation.left, env);
    const right = evaluate(operation.right, env);
    if (left.type == values_1.ValueNodeType.NumericLiteral && right.type == values_1.ValueNodeType.NumericLiteral) {
        return evaluateNumericBinExp(left, right, operation.operator);
    }
    return { type: values_1.ValueNodeType.NullLiteral, value: "निर्गुण" };
}
function evaluateProgram(program, env) {
    let lastStatement = { type: values_1.ValueNodeType.NullLiteral, value: "निर्गुण" };
    for (const statement of program.body) {
        lastStatement = evaluate(statement, env);
    }
    return lastStatement;
}
function evaluateAssignmentExpression(assignment, env) {
    if (assignment.assigne.type !== AST_1.AstNodeType.Identifier) {
        throw 'can not assign to non identifier node \n गैर पहचानकर्ता नोड को आवंटित नहीं किया जा सकता';
    }
    const name = assignment.assigne.name;
    return env.assign(name, evaluate(assignment.value, env));
}
exports.evaluateAssignmentExpression = evaluateAssignmentExpression;
function evaluateVariableDeclaration(declaration, env) {
    //declare variable
    const value = declaration.value ? evaluate(declaration.value, env) : { type: values_1.ValueNodeType.NullLiteral, value: "निर्गुण" };
    return env.declare(declaration.name, value, declaration.isConstant);
}
function evaluateObjectExpression(obj, env) {
    const object = { type: values_1.ValueNodeType.ObjectLiteral, properties: new Map() };
    for (const { key, value } of obj.properties) {
        const runtimeValue = (value == undefined) ? env.lookup(key) : evaluate(value, env);
        //handles valid key: pair
        object.properties.set(key, runtimeValue);
    }
    return object;
}
exports.evaluateObjectExpression = evaluateObjectExpression;
function evaluateCallExpression(expression, env) {
    const params = expression.params.map(param => evaluate(param, env));
    const fxn = evaluate(expression.caller, env);
    if (fxn.type == values_1.ValueNodeType.NativeFunctions) {
        let result = fxn.call(params, env);
        return result;
    }
    if (fxn.type == values_1.ValueNodeType.FunctionDeclaration) {
        const fn = fxn;
        const scope = new environment_1.default(fn.declarationEnvironment);
        for (let i = 0; i < fn.params.length; i++) {
            scope.declare(fn.params[i], params[i], true);
        }
        let result = (0, values_1.MK_NULL)();
        for (const statement of fn.body) {
            result = evaluate(statement, scope);
        }
        return result;
    }
    console.log(fxn.type);
    throw "गैर-कर्म मान को बुला नहीं सकते" + JSON.stringify(fxn);
}
exports.evaluateCallExpression = evaluateCallExpression;
function evaluateFunctionDeclaration(declaration, env) {
    const fxn = {
        type: values_1.ValueNodeType.FunctionDeclaration,
        name: declaration.name,
        params: declaration.parameters,
        body: declaration.body,
        declarationEnvironment: env
    };
    return env.declare(declaration.name, fxn, true);
}
