import { NullValueNode, NumericValueNode, ValueNode, ValueNodeType} from "./values";
import {AstNode, AstNodeType, ProgramNode, StatementNode, NumericLiteralNode, NullLiteralNode, BinaryExpressionNode} from "../AST"

export function evaluate(astNode:AstNode) : ValueNode
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
            return evaluateBinaryExpression(astNode as BinaryExpressionNode);

        case AstNodeType.Program:
            return evaluateProgram(astNode as ProgramNode);
        
        default:
            throw new Error("can not interpret this node "+astNode+"");
    }
            
    
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

function evaluateBinaryExpression(operation:BinaryExpressionNode):ValueNode
{
    const left = evaluate(operation.left);
    const right = evaluate(operation.right);

    if (left.type == ValueNodeType.NumericLiteral && right.type == ValueNodeType.NumericLiteral) {
        
        return evaluateNumericBinExp(left as NumericValueNode, right as NumericValueNode, operation.operator);
    }
    return {type:ValueNodeType.NullLiteral, value:"निर्गुण"} as NullValueNode
    
}

function evaluateProgram(program: ProgramNode): ValueNode {
        let lastStatement:ValueNode = {type: ValueNodeType.NullLiteral , value:"निर्गुण"} as NullValueNode;
        for(const statement of program.body)
        {
            lastStatement = evaluate(statement);
        }
        return lastStatement;
    }


