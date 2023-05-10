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
  AssignmentExpressionNode,
  CallExpressionNode,
  MemberExpressionNode,
  PropertyNode,
  ObjectLiteralNode,
  ExpressionNode,
  FunctionDeclarationNode,
  BlockNode,
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
          return parseVariableDeclaration();
         case Ttoken.Function:
          return parseFunctionDeclaration();
         case Ttoken.OpenBrace:
          
          return parseBlockExpression();
      }
    }

    function parseExpression():ExpressionNode
    {
      
      //return the expression lowest in the precedence
      return parseAsignmentExpression();
      
    }
    function parseAdditiveExpression():ExpressionNode
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
    function parseMultiplicativeExpression():ExpressionNode
    {
        //parse the expression with the highest precedence
        let left = parseCallMemberExpression();
        
        while(tokens[0].value=="*" || tokens[0].value=="/" || tokens[0].value=="%")
        {
            const operator = advance().value;
            const right = parseCallMemberExpression();
            left = {
                type: AstNodeType.BinaryExpression,
                operator:operator,
                left,
                right,
              } as BinaryExpressionNode;
        }
        return left;
    }
    
    function parsePrimaryExpression():ExpressionNode
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

     function parseAsignmentExpression(): ExpressionNode {
        
      const left = parseObjectExpression();
      
      if(tokens[0].type == Ttoken.Equals)
      {
        
        advance(); //advance past equal token
        
        const value = parseAsignmentExpression()
        return {value:value, assigne:left, type:AstNodeType.AssignmentExpression} as AssignmentExpressionNode

      }
      
        return left;
    }
    function parseObjectExpression():ExpressionNode
    {
      if(tokens[0].type !== Ttoken.OpenBrace)
      {
        return parseAdditiveExpression();
      }
        advance() //advance past open brace
        
        const properties = new Array<PropertyNode>();
        // eslint-disable-next-line
        while(notEOF() && tokens.at(0)?.type !==Ttoken.CloseBrace)
        {
          
          const key = expect(Ttoken.Identifier, "विशेषण की अपेक्षा थी");
          let token = tokens[0]
          
          //allows obj = {key,}
          if(token.type === Ttoken.Comma)
          {
            advance() //advance past comma
            
            properties.push({key:key.value, type:AstNodeType.Property} as PropertyNode)
            continue;
          } 
          //allows obj = {key}
          else if(token.type === Ttoken.CloseBrace)
            {
              advance() //advance past comma
              
              properties.push({key:key.value, type:AstNodeType.Property} as PropertyNode)
              continue;
            }

          //allows {key1:val}

          expect(Ttoken.Colon, ", की अपेक्षा थी");
          const value = parseExpression();
          properties.push({key:key.value, value:value, type:AstNodeType.Property} as PropertyNode)
          if(tokens.at(0)?.type !== Ttoken.CloseBrace)
          {
            expect(Ttoken.Comma, ", की अपेक्षा थी");

          }
          
        }
        expect(Ttoken.CloseBrace, "} की अपेक्षा थी");
        return { 
          type:AstNodeType.ObjectLiteral,
          properties:properties,
         } as ObjectLiteralNode
        
      }
    //type:foo.x()
    function parseCallMemberExpression():ExpressionNode {
      const member = parseMemberExpression()
      
      if(tokens[0].type == Ttoken.OpenParanthesis)
      {
        return parseCallExpression(member);
      }
      return member
    }

    function parseCallExpression(caller:AstNode):ExpressionNode
    {
      let expression:AstNode = {

        type:AstNodeType.CallExpression,
        caller:caller,
        params:parseParams(),

      } as CallExpressionNode   

      //this allows chaining of calls like foo.x()()
      if(tokens[0].type==Ttoken.OpenParanthesis)
      {
        
        expression = parseCallExpression(expression)  
      }

      return expression;
    }

    function parseMemberExpression():ExpressionNode
    {
      let object = parsePrimaryExpression();
      
      while( tokens[0].type == Ttoken.DotOperator || tokens[0].type == Ttoken.OpenBracket)
      {
        const operator = advance();
        let property:ExpressionNode;
        let isComputed:boolean; 

        //for dot operator (non-computed values)
        if(operator.type == Ttoken.DotOperator)
        { 
          
          isComputed = false;
          property = parsePrimaryExpression();
          if(property.type!== AstNodeType.Identifier)
          {
            throw 'डॉट संचालक (.) के बाद पहचानकर्ता की अपेक्षा थी।'
          }
        }
          //allows obj[computed Value]
          else{
            
            isComputed = true;
            
            property = parseExpression();
            
            expect(Ttoken.CloseBracket, "] की अपेक्षा थी।")
            
          }
          object = {
          type:AstNodeType.MemberExpression,
          object:object,
          property:property,
         } as MemberExpressionNode
        
        
      }
     
      return object
       
    }


    function parseParamsList():ExpressionNode[]
    {
      const params = [parseAsignmentExpression()]
      while(tokens[0].type == Ttoken.Comma && advance())
      {
        params.push(parseAsignmentExpression())
      }
      return params
    }

    function parseParams():ExpressionNode[]
    {
        expect(Ttoken.OpenParanthesis, "( की अपेक्षा है।")
        const params = tokens[0].type == Ttoken.CloseParanthesis ? [] : parseParamsList();

        expect(Ttoken.CloseParanthesis, ") की अपेक्षा है।")
        return params
    }

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
    function parseFunctionDeclaration(): AstNode
      {
        advance(); //skips प्रगट keyword
        const name = expect(Ttoken.Identifier, "कर्म शब्द के बाद कर्म के नाम की अपेछा थी ").value

        const args = parseParams();
        const params:string[] = [];
        for(const arg of args)
        {
          if(arg.type !== AstNodeType.Identifier)
            throw "मापक श्रृंखला के प्रकार के होने चाहिए। जैसे कि: कर्म जोड़(एक,दो) ।"+arg
          params.push((arg as IdentifierNode).name)
        }
        const body = parseBlockExpression()
        const fxn = {body:body, name:name, parameters:params, type:AstNodeType.FunctionDeclaration} as FunctionDeclarationNode
        return fxn

      }
      
      function parseBlockExpression(): AstNode
      { 
        if(tokens[0].type == Ttoken.OpenBrace)
          advance(); 
        else
          expect(Ttoken.OpenBrace, "{ की अपेछा थी");
        const body: AstNode[] = []
        while(tokens.at(0)?.type !== Ttoken.CloseBrace && tokens.at(0)?.type !== Ttoken.EndOfFile)
            body.push(parseStatement())
        expect(Ttoken.CloseBrace, "} की अपेछा थी");
        return {body:body, type:AstNodeType.Block} as BlockNode
        
        //return parseAsignmentExpression()
      }
}







