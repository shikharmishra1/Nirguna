import { ArrayValueNode, BlockValueNode, BooleanValueNode, FunctionValueNode, MK_NULL, MK_NUMBER, NativeFunctionNode, NullValueNode, NumericValueNode, ObjectValueNode, StringValueNode, ValueNode, ValueNodeType} from "./values";
import {AstNode, FunctionDeclarationNode, AstNodeType, ProgramNode, StatementNode, NumericLiteralNode, NullLiteralNode, BinaryExpressionNode, IdentifierNode, VariableDeclarationNode, AssignmentExpressionNode, ObjectLiteralNode, CallExpressionNode, BlockNode, ConditionalStatementNode, LoopStatementNode, StringLiteralNode, ArrayNode, MemberExpressionNode, UnaryExpressionNode} from "../AST"
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
        
        case AstNodeType.StringLiteral:
            return {
                type: ValueNodeType.StringLiteral,
                value: (astNode as StringLiteralNode).value,
            } as StringValueNode;
        
        case AstNodeType.Array:
            return evaluateArray(astNode as ArrayNode, env);
        case AstNodeType.NullLiteral:
            return {
                
                type: ValueNodeType.NullLiteral,
                value: (astNode as NullLiteralNode).value,
                
            } as NullValueNode;
            case AstNodeType.BinaryExpression:
            return evaluateBinaryExpression(astNode as BinaryExpressionNode, env);
        
        case AstNodeType.LoopStatement:
            return evaluateLoopStatement(astNode as LoopStatementNode, env);

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
        case AstNodeType.MemberExpression:
            return evaluateMemberExpression(astNode as MemberExpressionNode, env);
        case AstNodeType.UnaryExpression:
            return evaluateUnaryExpression(astNode as UnaryExpressionNode, env);


        
        
        default:
            throw `can not interpret this node\n ${JSON.stringify(astNode, null, 2)} `;
    }
            
    
}

function evaluateMemberExpression(astNode: MemberExpressionNode, env: Environment): ValueNode {
    const object = evaluate(astNode.object, env);
    const property = evaluate(astNode.property, env);
    if(object.type == ValueNodeType.Array)
    {
        if(property.type == ValueNodeType.NumericLiteral)
        {
            if((property as NumericValueNode).value < 0 || (property as NumericValueNode).value >= (object as ArrayValueNode).value.length)
                throw `${(object as ArrayValueNode).value}`
            return (object as ArrayValueNode).value[(property as NumericValueNode).value]
        }
        else
        {
            throw 'index must be a number'
        }
    }
    throw 'index must be a number'

}

function evaluateIdentifier(identifier:IdentifierNode, env:Environment):ValueNode
{
    const value = env.lookup(identifier.name)
    return value
}

function evaluateUnaryExpression(node:UnaryExpressionNode, env:Environment):BooleanValueNode
{
    switch(node.operator)
    {
        case "!":
            const operand = (evaluate(node.operand, env) as BooleanValueNode).value;
            
            return {type:ValueNodeType.BooleanLiteral, value:!(operand)} as BooleanValueNode
        default:
            throw "not a unary expression"
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

function evaluateStringBinOp(left:StringValueNode, right:StringValueNode, operator: string):StringValueNode
{
    let result:string = "";
    switch(operator)
    {
        
        case '+':
            result=left.value+right.value;
            break;
        case '-':
            result=left.value.replace(right.value, '');
            break;

        case "*":
            result=getStringIntersection(left.value,right.value);  //computes intersection of two strings
            break;
        
        default:
            throw `अमान्य संचालक ${operator} का प्रयोग शब्दों के साथ वर्जित है । `
        

    }
    
    
    return {type:ValueNodeType.StringLiteral,value:result } as StringValueNode
}

function getStringIntersection(str1: string, str2: string): string {
    const set = new Set<string>(str1);
    const intersection: string[] = [];
  
    for (const char of str2) {
      if (set.has(char)) {
        intersection.push(char);
        set.delete(char);
      }
    }
  
    return intersection.join('');
  }
  
  

  

function evaluateBooleanBinExp(left:BooleanValueNode, right:BooleanValueNode, operator: string):BooleanValueNode
{
    let result:boolean = false;
    switch(operator)
    {
        case '+':
            result = left.value || right.value
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
        case "==":
            result = left.value == right.value
            break;
    }
    return {type:ValueNodeType.BooleanLiteral, value:result} as BooleanValueNode
}
function evaluateLogicalExpression(left:NumericValueNode, right:NumericValueNode, operator: string):BooleanValueNode
{
    let result:boolean = false;
    switch(operator)
    {
        case '+':
        case '-':
        case "*":           
        case "/":
        case "%":
        case "और":

        case "या":
            `सत्यत्व कार्य के समय ${operator} का प्रयोग वर्जित है । `;
            break;


        case "<":
            result = left.value < right.value
            break;
        case ">":
            result = left.value > right.value
            break;
        case "<=":

            result = left.value <= right.value
            break;
        case ">=":
            result = left.value >= right.value
            break;
        case "==":
            result = left.value == right.value
            break;
        case "!=":
            result = left.value != right.value
            break;
    }
    
    //console.log(result)
    return {type:ValueNodeType.BooleanLiteral,value:result } as BooleanValueNode
}


function evaluateLoopStatement(loop:LoopStatementNode, env:Environment):ValueNode
{
    const body:BlockNode = loop.body
    switch(loop.loopType)
    {   
        case "for": {
            
            const to: NumericValueNode = evaluate(loop.to, env) as NumericValueNode;
          
            let fromValue: number;
          
            if (loop.from.type === AstNodeType.VariableDeclaration) {
              evaluate(loop.from, env);
          
              const fromName = (loop.from as VariableDeclarationNode).name;
              fromValue = (env.lookup(fromName) as NumericValueNode).value;
          
              if (fromValue <= to.value) {
                while (fromValue !== to.value) {
                  evaluateBlockStatement(body, env);
                  env.assign(fromName, MK_NUMBER(++fromValue));
                }
                env.delete(fromName);
              } else {
                while (fromValue !== to.value) {
                  evaluateBlockStatement(body, env);
                  env.assign(fromName, MK_NUMBER(--fromValue));
                }
              }
            } else if (loop.from.type === AstNodeType.AssignmentExpression) {
              evaluate(loop.from, env);
          
              const fromName = ((loop.from as AssignmentExpressionNode).assigne as VariableDeclarationNode).name;
              fromValue = (env.lookup(fromName) as NumericValueNode).value;
          
              if (fromValue <= to.value) {
                while (fromValue !== to.value) {
                  evaluateBlockStatement(body, env);
                  env.assign(fromName, MK_NUMBER(++fromValue));
                }
              } else {
                while (fromValue !== to.value) {
                  evaluateBlockStatement(body, env);
                  env.assign(fromName, MK_NUMBER(--fromValue));
                }
              }
            } else {
              throw "unrecognized";
            }
          }
          
        break;
        case "while":
            {
                while((evaluate(loop.whileCondition, env) as BooleanValueNode).value)
                {
                    evaluateBlockStatement(body, env)
                }
               break; 
            }
        case "doWhile":
            {
                do
                {
                    evaluateBlockStatement(body, env)
                } while((evaluate(loop.whileCondition, env) as BooleanValueNode).value)


            }

        }
   

    return {} as ValueNode
}

function evaluateBinaryExpression(operation:BinaryExpressionNode, env:Environment):ValueNode
{
    const left = evaluate(operation.left, env);
    const right = evaluate(operation.right, env);
    
    if(left.type == ValueNodeType.NumericLiteral && right.type == ValueNodeType.NumericLiteral && ["<", ">", "<=", ">=", "==", "!="].includes(operation.operator))
    {
        return evaluateLogicalExpression(left as NumericValueNode, right as NumericValueNode, operation.operator)
    }

    else if (left.type == ValueNodeType.NumericLiteral && right.type == ValueNodeType.NumericLiteral && ["<", ""]) {
        
        return evaluateNumericBinExp(left as NumericValueNode, right as NumericValueNode, operation.operator);
            
    }

    else if (left.type == ValueNodeType.StringLiteral && right.type == ValueNodeType.StringLiteral && ["<", ""]) {
        
        return evaluateStringBinOp(left as StringValueNode, right as StringValueNode, operation.operator);
            
    }

   if (left.type == ValueNodeType.BooleanLiteral && right.type == ValueNodeType.BooleanLiteral) {
        
        return evaluateBooleanBinExp(left as BooleanValueNode, right as BooleanValueNode, operation.operator);
    }
    throw "invalid operation"
    
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
        if (assignment.assigne.type === AstNodeType.MemberExpression) {
            const object = evaluate((assignment.assigne as MemberExpressionNode).object, env);
            const property = evaluate((assignment.assigne as MemberExpressionNode).property, env);
            const name = ((assignment.assigne as MemberExpressionNode).object as IdentifierNode).name;
            const arr = (env.lookup(name) as ArrayValueNode).value;
            arr[(property as NumericValueNode).value] = evaluate(assignment.value, env);
            return env.assign(name, {type: ValueNodeType.Array, value: arr} as ArrayValueNode);
        }
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
   let trueElif = 0;
   
   if(condition.type==ValueNodeType.BooleanLiteral && (condition as BooleanValueNode).value)
    {
  
        return evaluateBlockStatement(conditionStmt.body, env);
    }
    else {
        // the if condition is false, so check the else if conditions
        if(conditionStmt.elifBody){
            for (const elif of conditionStmt.elifBody) {
                const elifCondition = evaluate(elif.condition, env);
                if (elifCondition.type === ValueNodeType.BooleanLiteral && (elifCondition as BooleanValueNode).value) {
                    trueElif++;
                    evaluateBlockStatement(elif.body, env);
                    
                }
        }

    }
    
    if (conditionStmt.elseBody && !(condition as BooleanValueNode).value && trueElif === 0) {
        // no if or else if conditions were true, so evaluate the else block if it exists
            return evaluateBlockStatement(conditionStmt.elseBody, env);
      } else {
        // no if or else if conditions were true, and there is no else block, so return undefined
        return {} as ValueNode;
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



function evaluateArray(arrNode: ArrayNode, env:Environment): ValueNode {
    let elements:ValueNode[] = [];
    for(let arr of arrNode.value)
    {
        elements.push(evaluate(arr, env))
    }
    return {type:ValueNodeType.Array, value:elements} as ArrayValueNode;
}

