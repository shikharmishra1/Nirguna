import { NullValueNode, NumericValueNode, ValueNode, ValueNodeType} from "./values";
import {AstNode, AstNodeType, ProgramNode, StatementNode, NumericLiteralNode, NullLiteralNode, BinaryExpressionNode, IdentifierNode, VariableDeclarationNode, AssignmentExpressionNode} from "../AST"
import Environment from "./environment";

export function evaluate(astNode:AstNode, env:Environment) : ValueNode
{
    switch(astNode.type)
    {
        case AstNodeType.NumericLiteral:
            return {
                type: ValueNodeType.NumericLiteral,
                value: (astNode as NumericLiteralNode).value,
                
            } as NumericValueNode;
        case AstNodeType.NullLiteral:
            return {
                
                type: ValueNodeType.NullLiteral,
                value: (astNode as NullLiteralNode).value,
                
            } as NullValueNode;
        case AstNodeType.BinaryExpression:
            return evaluateBinaryExpression(astNode as BinaryExpressionNode, env);

        case AstNodeType.Identifier:
            return evaluateIdentifier(astNode as IdentifierNode, env);
        
        case AstNodeType.VariableDeclaration:
            return evaluateVariableDeclaration(astNode as VariableDeclarationNode, env)


        case AstNodeType.Program:
            return evaluateProgram(astNode as ProgramNode, env);
        
        case AstNodeType.AssignmentExpression:
            return evaluateAssignmentExpression(astNode as AssignmentExpressionNode, env);

        
        
        default:
            throw "can not interpret this node "+JSON.stringify(astNode)+"";
    }
            
    
}

function evaluateIdentifier(identifier:IdentifierNode, env:Environment):ValueNode
{
    const value = env.lookup(identifier.name)
    return value
}


function evaluateNumericBinExp(left:NumericValueNode, right:NumericValueNode, operator: string):NumericValueNode
    {
        let result:number = 0;
        switch(operator)
        {
            case '+':
                result=left.value+right.value;
                break;
            case '-':
                result=left.value-right.value;
                break;

            case "*":
                result=left.value*right.value;
                break;
            case "/":
                result=left.value/right.value;
                break;

            case "%":
                result=left.value%right.value;
                break;
            
        }
        
        console.log(result);
        return {type:ValueNodeType.NumericLiteral,value:result }
    }

function evaluateBinaryExpression(operation:BinaryExpressionNode, env:Environment):ValueNode
{
    const left = evaluate(operation.left, env);
    const right = evaluate(operation.right, env);

    if (left.type == ValueNodeType.NumericLiteral && right.type == ValueNodeType.NumericLiteral) {
        
        return evaluateNumericBinExp(left as NumericValueNode, right as NumericValueNode, operation.operator);
    }
    return {type:ValueNodeType.NullLiteral, value:"निर्गुण"} as NullValueNode
    
}

function evaluateProgram(program: ProgramNode, env:Environment): ValueNode {
        let lastStatement:ValueNode = {type: ValueNodeType.NullLiteral , value:"निर्गुण"} as NullValueNode;
        for(const statement of program.body)
        {
            lastStatement = evaluate(statement, env);
        }
        return lastStatement;
    }

export function evaluateAssignmentExpression(assignment: AssignmentExpressionNode, env: Environment)
{
    if(assignment.assigne.type !== AstNodeType.Identifier)
    {
        throw 'can not assign to non identifier node \n गैर पहचानकर्ता नोड को आवंटित नहीं किया जा सकता'
    }
    const name = (assignment.assigne as IdentifierNode).name
    return env.assign(name, evaluate(assignment.value, env))
}

function evaluateVariableDeclaration(declaration: VariableDeclarationNode, env: Environment): ValueNode {
    //declare variable
    const value = declaration.value? evaluate(declaration.value, env) : {type: ValueNodeType.NullLiteral , value:"निर्गुण"} as NullValueNode
    return env.declare(declaration.name, value, declaration.isConstant)
}

