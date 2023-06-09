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
  ConditionalStatementNode,
  ElifNode,
  LoopStatementNode,
  StringLiteralNode,
  ArrayNode,
  
  UnaryExpressionNode,
} from "./AST";
import { MK_NULL } from "./runtime/values";

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
        case Ttoken.IfStmt:
        case Ttoken.ElseStmt:
          return parseConditionalStatement();
        
        case Ttoken.Loop:
          return parseLoopStatement();
      }
    }

    function parseArray():AstNode
    {
      
      expect(Ttoken.OpenBracket, "[ की अपेक्षा थी।")
      const elements  = Array<ExpressionNode>();
      while(tokens[0].type !== Ttoken.CloseBracket)
      {
         const element = parseExpression();
          elements.push(element);
        if(tokens[0].type == Ttoken.Comma)
        {
          advance();
        }
      }
      expect(Ttoken.CloseBracket, "] की अपेक्षा थी।")
      //expect(Ttoken.PurnaViraam, "पूर्णविराम की अपेक्षा थी।")
      return {type:AstNodeType.Array, value:elements} as ArrayNode
    }


    function parseExpression():ExpressionNode
    {
      
      //return the expression lowest in the precedence
      return parseAsignmentExpression();
      
    }

    function parseConditionalExpression():ExpressionNode
    {
        let left = parseUnaryExpression();

        while(tokens[0].type==Ttoken.AndOperator||tokens[0].type==Ttoken.OrOperator||tokens[0].type==Ttoken.ConditionalOperator)
        {
            const operator = advance().value;
            
            const right = parseUnaryExpression();
            
            left = {
                type: AstNodeType.BinaryExpression,
                operator:operator,
                left,
                right,
              } as BinaryExpressionNode;
        }
        return left;
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
    function parseUnaryExpression():ExpressionNode
    {
      while(tokens[0].type==Ttoken.UnaryOperator)
      {
        const operator = advance().value;
        const right = parseCallMemberExpression();
        return {
          type: AstNodeType.UnaryExpression,
          operator:operator,
          operand:right,
        } as UnaryExpressionNode;
      }
      
      return parseCallMemberExpression();
    }
   
    function parseMultiplicativeExpression():ExpressionNode
    {
        //parse the expression with the highest precedence
        let left = parseConditionalExpression();
        
        while(tokens[0].value=="*" || tokens[0].value=="/" || tokens[0].value=="%")
        {
            const operator = advance().value;
            const right = parseConditionalExpression();
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
            

            case Ttoken.Str:
              return parseStringLiteral();
        
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
       

       if(tokens.at(0)?.type==Ttoken.From)
        {
            advance()
            return {value:value, assigne:left, type:AstNodeType.AssignmentExpression} as AssignmentExpressionNode
        }

        return {value:value, assigne:left, type:AstNodeType.AssignmentExpression} as AssignmentExpressionNode
        

      }
      
        return left;
    }
    function parseObjectExpression():ExpressionNode
    {
      if(tokens.at(0)?.type == Ttoken.OpenBracket)
      {
        console.log('uwu')
        return parseArray();
      }

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
        const body = parseBlockExpression("function")
        const fxn = {body:body, name:name, parameters:params, type:AstNodeType.FunctionDeclaration} as FunctionDeclarationNode
        return fxn

      }

      function parseLoopStatement():AstNode
      {
        advance(); //skips the चक्र keyword
        
        let loopType = "";
        let from:AstNode;
        let to:AstNode;
        let body:AstNode;
        let whileCondition:AstNode;

        
        if(tokens[0].type==Ttoken.OpenBrace)
        {
          console.log(tokens[1].type)
          body = parseBlockExpression("loop")
          expect(Ttoken.DoWhile, "चक्र के बाद 'जब' शब्द की अपेछा थी")
          expect(Ttoken.From, "चक्र के बाद से की अपेछा थी")
          whileCondition = parseConditionalExpression();
          expect(Ttoken.CloseParanthesis, ") की अपेछा थी")
          return {body:body, whileCondition:whileCondition, loopType:"doWhile", type:AstNodeType.LoopStatement } as LoopStatementNode
          
        }

        expect(Ttoken.OpenParanthesis, "( की अपेछा थी")
        if(tokens[0].type==Ttoken.Variable || tokens[0].type==Ttoken.Constant)
          {
            //for 
            console.log('for')

            from = parseVariableDeclaration();
            
            expect(Ttoken.From, "चक्र के बाद से की अपेछा थी")
            to = parseExpression();
            expect(Ttoken.CloseParanthesis, ") की अपेछा थी")
            const body = parseBlockExpression("loop")
            return {from:from, to:to, body:body, loopType:"for", type:AstNodeType.LoopStatement } as LoopStatementNode
            
          }
        
        if(tokens.at(0)?.type==Ttoken.Identifier)
        {
          if(tokens.at(1)?.type==Ttoken.ConditionalOperator)
          {
            //while loop
            whileCondition = parseConditionalExpression();
            expect(Ttoken.CloseParanthesis, ") की अपेछा थी")
            body = parseBlockExpression("loop");

            console.log(whileCondition)
            return {whileCondition:whileCondition,body:body, loopType:"while", type:AstNodeType.LoopStatement } as LoopStatementNode
          }

          //चक्र (अ = something से something)
          console.log(tokens.at(0))
          from = parseExpression();
          to = parseExpression();
          expect(Ttoken.CloseParanthesis, ") की अपेछा थी")
          body = parseBlockExpression("loop");
          
          return {from:from, to:to, body:body, loopType:"for", type:AstNodeType.LoopStatement } as LoopStatementNode
        }  
        else
          {
            //
            return {} as AstNode
            //while loop
          }

      }

      function parseConditionalStatement(): AstNode
      {
          advance(); //skips if  keyword
          expect(Ttoken.OpenParanthesis, "no( की अपेछा थी")
          const condition = parseConditionalExpression()
          expect(Ttoken.CloseParanthesis, ") की अपेछा थी")
      
          const body = parseBlockExpression("conditional")
          if(tokens.at(0)?.type==Ttoken.ElIfStmt)
          {
            
            let elifBodies:AstNode[] =[];
            while(tokens.at(0)?.type==Ttoken.ElIfStmt)
            {
              advance();
              advance(); //skips elif

              expect(Ttoken.OpenParanthesis, "( की अपेछा थी")
              const elifCondition = parseConditionalExpression()
              expect(Ttoken.CloseParanthesis, ") की अपेछा थी")
              const elifBody = parseBlockExpression()
              const elif = { body:elifBody, condition:elifCondition,type:AstNodeType.ElifStatement } as ElifNode;
              elifBodies.push(elif)

              if(tokens.at(0)?.type==Ttoken.ElseStmt)
              {

                advance();
                advance();
                const elseBody = parseBlockExpression("conditional")
                return {body:body, elifBody:elifBodies, condition:condition, elseBody:elseBody, conditionType:"if", type:AstNodeType.ConditionalStatement} as ConditionalStatementNode
                
              }
            }

            return {body:body, condition:condition ,conditionType:"if", type:AstNodeType.ConditionalStatement} as ConditionalStatementNode
          }
          

           if(tokens.at(0)?.type==Ttoken.ElseStmt)
          {
            
            advance()
            advance()
            let elseBody:AstNode;
            
            elseBody = parseBlockExpression("conditional")
            return {body:body, condition:condition, elseBody:elseBody, conditionType:"if", type:AstNodeType.ConditionalStatement} as ConditionalStatementNode
            //expect(Ttoken.CloseBrace, "} की अपेछा थी")
          }
          else
          return {body:body, condition:condition, conditionType:"if", type:AstNodeType.ConditionalStatement} as ConditionalStatementNode
        
        
       
      }
      function parseStringLiteral(): ExpressionNode {
              let str = advance().value; //advance quote

              return {type:AstNodeType.StringLiteral, value:str} as StringLiteralNode
      } 

      
      //for anonymous blocks
      function parseBlockExpression(context?:String): AstNode
      { 
        let hasContinue = false;
        if(tokens[0].type == Ttoken.OpenBrace)
          advance(); 
        else
          expect(Ttoken.OpenBrace, "{ की अपेछा थी");
        const body: AstNode[] = []
        while(tokens.at(0)?.type !== Ttoken.CloseBrace && tokens.at(0)?.type !== Ttoken.EndOfFile)
        {   
          
          if(tokens.at(0)?.type!==Ttoken.Break && tokens.at(0)?.type!==Ttoken.Return && tokens.at(0)?.type!==Ttoken.Continue )
              body.push(parseStatement())
          
          //for break statements
            
        }
        expect(Ttoken.CloseBrace, "} की अपेछा थी");
        
        return {body:body, type:AstNodeType.Block, hasContinue:hasContinue, context:context} as BlockNode
        
        //return parseAsignmentExpression()
      }
      








    }


