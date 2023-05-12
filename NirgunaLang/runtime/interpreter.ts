import { BlockValueNode, BooleanValueNode, FunctionValueNode, MK_NULL, NativeFunctionNode, NullValueNode, NumericValueNode, ObjectValueNode, ValueNode, ValueNodeType} from "./values";
import {AstNode, FunctionDeclarationNode, AstNodeType, ProgramNode, StatementNode, NumericLiteralNode, NullLiteralNode, BinaryExpressionNode, IdentifierNode, VariableDeclarationNode, AssignmentExpressionNode, ObjectLiteralNode, CallExpressionNode, BlockNode, ConditionalStatementNode} from "../AST"
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

        case AstNodeType.FunctionDeclaration:
            return evaluateFunctionDeclaration(astNode as FunctionDeclarationNode, env)
        
        case AstNodeType.Block:
            return evaluateBlockStatement(astNode as BlockNode, env)

        case AstNodeType.Program:
            return evaluateProgram(astNode as ProgramNode, env);
        
        case AstNodeType.AssignmentExpression:
            return evaluateAssignmentExpression(astNode as AssignmentExpressionNode, env);

        case AstNodeType.ObjectLiteral:
            return evaluateObjectExpression(astNode as ObjectLiteralNode, env);
        
        case AstNodeType.CallExpression:
            return evaluateCallExpression(astNode as CallExpressionNode, env);
       
        case AstNodeType.ConditionalStatement:
            {
                return evaluateConditionalStatements(astNode as ConditionalStatementNode, env);
            }

        
        
        default:
            throw `can not interpret this node\n ${JSON.stringify(astNode, null, 2)} `;
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
                if(right.value==0)
                    throw 'division by zero is impossible'
                break;

            case "%":
                result=left.value%right.value;
                break;
            
            case "और":
                result = left.value && right.value
            case "या":
                result = left.value || right.value
        }
        
        
        return {type:ValueNodeType.NumericLiteral,value:result }
    }

function evaluateBooleanBinExp(left:BooleanValueNode, right:BooleanValueNode, operator: string):BooleanValueNode
{
    let result:boolean = false;
    switch(operator)
    {
        case '+':
        case '-':
        case "*":           
        case "/":
        case "%":
            `सत्यत्व कार्य के समय ${operator} का प्रयोग वर्जित है । `;
            break;

        
        case "और":
            result = left.value && right.value
            break;
        case "या":
            result = left.value || right.value
            break;
    }
    
    //console.log(result)
    return {type:ValueNodeType.BooleanLiteral,value:result } as BooleanValueNode
}

function evaluateBinaryExpression(operation:BinaryExpressionNode, env:Environment):ValueNode
{
    const left = evaluate(operation.left, env);
    const right = evaluate(operation.right, env);

    if (left.type == ValueNodeType.NumericLiteral && right.type == ValueNodeType.NumericLiteral) {
        
        return evaluateNumericBinExp(left as NumericValueNode, right as NumericValueNode, operation.operator);
    }

   if (left.type == ValueNodeType.BooleanLiteral && right.type == ValueNodeType.BooleanLiteral) {
        
        return evaluateBooleanBinExp(left as BooleanValueNode, right as BooleanValueNode, operation.operator);
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

export function evaluateObjectExpression(obj: ObjectLiteralNode, env: Environment) : ValueNode
{
    const object = {type:ValueNodeType.ObjectLiteral, properties: new Map()} as ObjectValueNode;
    for (const {key, value} of obj.properties) {
        const runtimeValue = (value==undefined) ? env.lookup(key) : evaluate(value, env);
        //handles valid key: pair
        object.properties.set(key, runtimeValue)
    }
    return object;
} 

export function evaluateCallExpression(expression: CallExpressionNode, env: Environment) : ValueNode
{
    const params:ValueNode[] = expression.params.map(param => evaluate(param, env));
    const fxn = evaluate(expression.caller, env);
    if(fxn.type == ValueNodeType.NativeFunctions)
    {
        let result = (fxn as NativeFunctionNode).call(params, env);
        return result;
        
    } 
    if(fxn.type == ValueNodeType.FunctionDeclaration)
    {
        const fn = fxn as FunctionValueNode;
        const scope = new Environment(fn.declarationEnvironment);

        for(let i=0; i<fn.params.length; i++)
            scope.declare(fn.params[i], params[i], true);
        
        return evaluateBlockStatement(fn.body, scope);
    }
    
    
    
    throw "गैर-कर्म मान को बुला नहीं सकते"+JSON.stringify(fxn);
    
} 

function evaluateConditionalStatements(conditionStmt:ConditionalStatementNode , env: Environment): ValueNode {
   const condition  = evaluate(conditionStmt.condition, env);
   let conditionEvaluated:boolean = false;
   if(condition.type==ValueNodeType.BooleanLiteral && (condition as BooleanValueNode).value)
    {
        console.log('if')
        return evaluateBlockStatement(conditionStmt.body, env);
    }
    else {
        // the if condition is false, so check the else if conditions
        for (const elif of conditionStmt.elifBody) {
          const elifCondition = evaluate(elif.condition, env);
          if (elifCondition.type === ValueNodeType.BooleanLiteral && (elifCondition as BooleanValueNode).value) {
             evaluateBlockStatement(elif.body, env);
             
          }
          
        }
    
    if (conditionStmt.elseBody && !(condition as BooleanValueNode).value) {
        // no if or else if conditions were true, so evaluate the else block if it exists
            return evaluateBlockStatement(conditionStmt.elseBody, env);
      } else {
        // no if or else if conditions were true, and there is no else block, so return undefined
        return MK_NULL();
      }


    }

}



function evaluateFunctionDeclaration(declaration: FunctionDeclarationNode, env: Environment): ValueNode {
    const fxn = 
    {
        type:ValueNodeType.FunctionDeclaration,
        name:declaration.name,
        params:declaration.parameters,
        body:declaration.body,
        declarationEnvironment:env
    } as FunctionValueNode

    return env.declare(declaration.name, fxn, true)
}


function evaluateBlockStatement(block: BlockNode, env: Environment, context?:string): ValueNode {

    const scope = new Environment(env);
    let lastStatement:ValueNode = MK_NULL();
    for(const statement of block.body)
    {
        if(block.hasContinue)
        {
            console.log('continue found')
        }
        
        lastStatement = evaluate(statement, scope);
    }
    
    return lastStatement;

}



