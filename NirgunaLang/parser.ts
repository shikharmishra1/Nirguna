import { tokenize, Token, Ttoken } from "./lexer";
import {
  AstNode,
  AstNodeType,
  BinaryExpressionNode,
  IdentifierNode,
  NumericLiteralNode,
  ProgramNode,
  NullLiteralNode,
  VariableDeclarationNode,
  StatementNode,
} from "./AST";

export function parse(inputCode: string): AstNode {
    let tokens:Token[] = [...tokenize(inputCode)]

    
    //determines if parser have reached the end of the file
    function notEOF(): boolean {
        return tokens[0].type != Ttoken.EndOfFile;
        
      }



    //return previous token and advances to next one
    function advance():Token
    {
        const previousToken = tokens.shift() as Token;
        
        return previousToken;
    }

    function expect(type: Ttoken, error: any):Token {
        const previousToken = tokens.shift() as Token;
        if (!previousToken || previousToken.type != type) {
          console.error("Parser Error:\n", error, previousToken, " - Expecting: ", type);
          
        }
    
        return previousToken;
      }
    
    function parseStatement():AstNode
    {
      switch(tokens[0].type)
      {
        default:
         return parseExpression();
        
         case Ttoken.Variable:
         case Ttoken.Constant: 
         case Ttoken.Identifier:
          return parseVariableDeclaration();
      }
    }

    function parseExpression():AstNode
    {
        return parseAdditiveExpression();
    }
    function parseAdditiveExpression():AstNode
    {
        //
        let left = parseMultiplicativeExpression();
        while(tokens[0].value=="+"||tokens[0].value=="-")
        {
            const operator = advance().value;
            const right = parseMultiplicativeExpression();
            left = {
                type: AstNodeType.BinaryExpression,
                operator:operator,
                left,
                right,
              } as BinaryExpressionNode;
        }
        return left;
    }
    function parseMultiplicativeExpression():AstNode
    {
        let left = parsePrimaryExpression();
        while(tokens[0].value=="*"||tokens[0].value=="/"||tokens[0].value=="%")
        {
            const operator = advance().value;
            const right = parsePrimaryExpression();
            left = {
                type: AstNodeType.BinaryExpression,
                operator:operator,
                left,
                right,
              } as BinaryExpressionNode;
        }
        return left;
    }
    
    function parsePrimaryExpression():AstNode
    {
        const token = tokens[0].type;

        switch (token) {
            // User defined values.
            case Ttoken.Identifier:
              return { type: AstNodeType.Identifier, name: advance().value } as IdentifierNode;
        
            // Constants and Numeric Constants
            case Ttoken.Number:
              return {
                type: AstNodeType.NumericLiteral,
                value: parseFloat(advance().value),
              } as NumericLiteralNode;
        
            // Grouping Expressions
            case Ttoken.OpenParanthesis: {
              advance(); // advance the opening paren
              const value = parseExpression();
              expect(
                Ttoken.CloseParanthesis,
                "Unexpected token found inside parenthesized expression. Expected closing parenthesis.",
              ); // closing paren
              return value;
            }
            case Ttoken.Null:
              advance(); // advance the null token
              console.log("Null Literal Found")
              return {
                type: AstNodeType.NullLiteral,
                value:  "निर्गुण",
              } as NullLiteralNode;
        
            // Unidentified Tokens and Invalid Code Reached
            default:
              throw new Error("Unexpected token found during parsing!"+ [tokens[0].type, tokens[0].value]);
              
          }

    }
    const body:AstNode[] =[];
    while (notEOF()) {
        const statement = parseStatement();
        body.push(statement);
     }
    return {
        type: AstNodeType.Program,
        body,
     } as ProgramNode;

     function parseVariableDeclaration(): AstNode {
      const isConstant = advance().type == Ttoken.Constant;
      const identifier = expect(Ttoken.Identifier, "मान की घोषणा के बाद पहचानकर्ता के नाम की अपेक्षा है।").value;

      //type: मान एक । or नित्य एक।
      if(tokens[0].type==Ttoken.PurnaViraam)
      {
        advance();

        if(isConstant)
        {
          throw "नित्य मान की घोषणा के बाद एक मान की अपेक्षा है। जैसे कि: नित्य एक = १ ।"
        }
        return { 
          type:AstNodeType.VariableDeclaration, 
          name:identifier,  
          isConstant:false,
         } as VariableDeclarationNode;
      }

      //type: मान एक = १ ।
      expect(Ttoken.Equals, "मान की घोषणा के बाद एक मान की अपेक्षा है। जैसे कि: मान एक = १ ।");

      const declaration = {
        isConstant:isConstant,
        name: identifier,
        value: parseExpression(),
        type: AstNodeType.VariableDeclaration,
      } as VariableDeclarationNode

      expect(Ttoken.PurnaViraam, "मान की घोषणा के बाद पूर्णविराम (।) की अपेक्षा है। जैसे कि: मान एक = १ ।")
      return declaration
    }
  
}



