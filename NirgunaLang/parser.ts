import { tokenize, Token, Ttoken } from "./lexer";
import {
  AstNode,
  AstNodeType,
  BinaryExpressionNode,
  IdentifierNode,
  NumericLiteralNode,
  ProgramNode,
  VariableDeclarationNode,
  StatementNode,
} from "./AST";

function parse(inputCode: string): AstNode {
  const tokens:Token[] = [...tokenize(inputCode)]
  let currentTokenIndex = 0;

  function getNextToken(): Token {

    const token = tokens[currentTokenIndex++];
    if(!token || token.type === Ttoken.EndOfFile)
        return { type: Ttoken.EndOfFile, value: "EOF" };
    return token;
  }

function parseExpression(): AstNode {
    let left = parseTerm();
    
    while(true && getNextToken().type !== Ttoken.EndOfFile)
    {
        const token = getNextToken();
        if (!token) {
            throw new Error("Unexpected end of input");
          }
          
        if(token.type !== Ttoken.BinaryOperator)
        {
            const right = parseTerm();
            left = {
                type: AstNodeType.BinaryExpression,
                operator: token.value,
                left,
                right
            } as BinaryExpressionNode;
        }
        else {
            currentTokenIndex--;
            break;
          }

    }
    return left
    
}

function parseTerm(): AstNode {
    let token = getNextToken();
    switch(token.type) {
        case Ttoken.Identifier:
        return {
            type: AstNodeType.Identifier,
            name: token.value
        } as IdentifierNode;

        case Ttoken.Number:
        return {
          type: AstNodeType.NumericLiteral,
          value: parseInt(token.value),
        } as NumericLiteralNode;

        case Ttoken.OpenParanthesis:
        const expression = parseExpression();
        if (getNextToken().type !== Ttoken.CloseParanthesis) {
          throw new Error("Expected ')' after expression");
        }
        return expression;
        default:
            {
                console.log(token.value)
                throw new Error(`Unexpected token ${token.value}`);
            }
            
    }
}

function parseVariableDecleration(): AstNode {
    const nameToken = getNextToken();
    if(nameToken.type !== Ttoken.Identifier)
    {
        console.log(nameToken.type)
        throw new Error(`"परिवर्तनीय" के बाद अपेक्षित पहचानकर्ता(identifier) लिखें जैसे की "परिवर्तनीय अ = १००"`);
    }
    if (getNextToken().type !== Ttoken.Equals) {
        throw new Error(` "=" की अपेछा थी पर आपने "${nameToken.value}" के बाद "${getNextToken().value}" लिखा है`);
      }
    const value = parseExpression();
    return {
    type: AstNodeType.VariableDeclaration,
    name: nameToken.value,
    value,
    } as VariableDeclarationNode;

}

function parseStatement(): AstNode {
    const token = getNextToken();
    if (token.type === Ttoken.Variable) {
      return parseVariableDecleration();
    }
    currentTokenIndex--;
    const expression = parseExpression();
    return {
      type: AstNodeType.Statement,
      expression,
    } as StatementNode;
}

const body:AstNode[] =[];
while (currentTokenIndex < tokens.length) {
    const statement = parseStatement();
    body.push(statement);
  }
  return {
    type: AstNodeType.Program,
    body,
  } as ProgramNode;
  
}

const inputCode = "परिवर्तनीय अ = 10";
const ast = parse(inputCode);
console.log(JSON.stringify(ast, null, 2));