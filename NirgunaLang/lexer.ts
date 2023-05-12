
//type of token
export enum Ttoken {

  Identifier = "Identifier",
  Equals = "Equals",
  Comma = "Comma",
  OpenParanthesis = "OpenParanthesis", CloseParanthesis = "CloseParanthesis",
  OpenBrace = "OpenBrace", CloseBrace = "CloseBrace",
  OpenBracket = "OpenBracket", CloseBracket = "CloseBracket",
  Colon = "Colon",

  BinaryOperator = "BinaryOperator",
  Number = "Number",
  EndOfFile = "EndOfFile",
  PurnaViraam = "PurnaViraam",

  //operators
  ConditionalOperator = "Conditional Operator",
  DotOperator = "Dot Operator",
  AndOperator = "AndOperator",
  OrOperator = "OrOperator",
  NotOperator = "NotOperator",
  

  //keywords
  Constant = "Constant",
  Variable = "Variable",
  Null = "Null",
  Function = "Function",

  //Block control 
  Return = "Return",
  Continue = "Continue",
  Break = "Continue",


  //Conditional Statements
  IfStmt = "If",
  ElseStmt = "ElseStmt",
  ElIfStmt = "ElIfStmt"

}

const hindiToStandardDigits: { [key: string]: string } = {
  "०": "0",
  "१": "1",
  "२": "2",
  "३": "3",
  "४": "4",
  "५": "5",
  "६": "6",
  "७": "7",
  "८": "8",
  "९": "9"
};


function convertHindiToStandardDigits(str:string) {
  return str.replace(/[०-९]/g, (match:string) => hindiToStandardDigits[match]);
}



export interface Token
{
    value:string,
    type:Ttoken
}

//defines keywords in the language
const KEYWORDS:Record<string, Ttoken> = {
    मान:Ttoken.Variable,
    निर्गुण:Ttoken.Null,
    नित्य:Ttoken.Constant,
    कर्म:Ttoken.Function,
    वापस:Ttoken.Return,
    खंडन:Ttoken.Break,
    चालू:Ttoken.Continue,

    //conditional keywords
    यदि:Ttoken.IfStmt,
    उत:Ttoken.ElseStmt,
    'उत यदि':Ttoken.ElIfStmt,
    और:Ttoken.AndOperator,
    या:Ttoken.OrOperator
}



function token(value="", type:Ttoken):Token
{
    return {value, type};
}

function isSkippable(token: string) {
  return token === " " || token === "\n" || token === "\t" || token === "\r"
  
  
}



export function* tokenize(inputCode:string):Generator<Token> {
    const src = inputCode.split("");

    const XRegExp = require("xregexp");
    
    const hindiIdentifierRegex = XRegExp("^\\p{Devanagari}(?!\\p{Nd})[\\p{Devanagari}]*$");
    const hindiDigitsRegex = XRegExp("[\\p{Devanagari}\\u0966-\\u096F]+");


    
    let skipLine = false;
    
    //tokenizes the input code, yielding tokens one by one to save memory
    while (src.length > 0) {
      const uwu = convertHindiToStandardDigits(src[0]);
      
      //skips the whole line
      if (skipLine) {
        if (src[0] === "\n") {
          skipLine = false;
        }
        src.shift();
        continue;
      }
      
      //skips whe encountered # token
      if (src[0] === "#") {
        skipLine = true;
        src.shift();
        continue;
      }

      if (src[0] === "(") {
        yield token(src.shift(), Ttoken.OpenParanthesis);
      } else if (src[0] === ")") {
        yield token(src.shift(), Ttoken.CloseParanthesis);
      } else if (src[0] === "{") {
        yield token(src.shift(), Ttoken.OpenBrace);
      } else if (src[0] === "}") {
        yield token(src.shift(), Ttoken.CloseBrace);
      } else if (["+","-","*","/","%"].includes(src[0])) {
        yield token(src.shift(), Ttoken.BinaryOperator);
      } else if (src[0] === ".") {
        yield token(src.shift(), Ttoken.DotOperator);
      } else if (src[0] === "<") {
          if(src[0]+src[1]==="<=")
          {
            
            yield token(src.shift()!+src.shift()!, Ttoken.ConditionalOperator);
            
          }
          else
            yield token(src.shift(), Ttoken.ConditionalOperator);
      } else if(src[0] === ">") {
          if(src[1]==="=")
            {
              yield token(src.shift()!+src.shift()!, Ttoken.ConditionalOperator);
            
            }
            else
              yield token(src.shift(), Ttoken.ConditionalOperator);
      }
      
      else if (src[0] === "।") {
        yield token(src.shift(), Ttoken.PurnaViraam);
      } else if (["+","-","*","/","%"].includes(src[0])) {
        yield token(src.shift(), Ttoken.BinaryOperator);
      } else if(src[0]==='='){
          if(src[1]==="=")
          {
            yield token(src.shift()!+src.shift()!, Ttoken.ConditionalOperator);
          
          }
          else
            yield token(src.shift(), Ttoken.Equals);
      } else if(src[0]==='!'){
          if(src[1]==="=")
          {
            yield token(src.shift()!+src.shift()!, Ttoken.ConditionalOperator);
          
          }
          else
            yield token(src.shift(), Ttoken.NotOperator);
    }
      
      
       else if(src[0]===','){
        yield token(src.shift(), Ttoken.Comma);
      } else if(src[0]===':'){
        yield token(src.shift(), Ttoken.Colon);
      } else if(src[0]==='['){
        yield token(src.shift(), Ttoken.OpenBracket);
      } else if(src[0]===']'){
        yield token(src.shift(), Ttoken.CloseBracket);
      }
       
      //handles identifiers and keywords
       else if (hindiIdentifierRegex.test(src[0]) && !(/[०-९]/g.test(src[0])) ) {
        
        let identifier = "";
        while (src.length > 0 && hindiIdentifierRegex.test(src[0])) {
          identifier += src.shift();
        }
        if (KEYWORDS[identifier]!==undefined) {
          if(identifier=='उत')
          {
            
            if(src[1]+src[2]+src[3]=='\u092f\u0926\u093f')
            {
              src.shift();
              src.shift();
              src.shift();
              src.shift();
              yield token('उत यदि', KEYWORDS['उत यदि']);
            }
            else
            {

              yield token(identifier, KEYWORDS[identifier]);
            }
          }
          
          yield token(identifier, KEYWORDS[identifier]);
        } else {
          
          yield token(identifier, Ttoken.Identifier);
        }
        
      }
      //skips comments
      
      
      //handles numbers
      else if (/^[\d.]+$/.test(convertHindiToStandardDigits(src[0]))) {
        let num = "";
       
        while (src.length > 0 && /^[\d.]$/.test(convertHindiToStandardDigits(src[0]))) {
          num += convertHindiToStandardDigits(src.shift()??"");
          
        }
        yield token(num, Ttoken.Number);
      }
   
      else if (isSkippable(src[0])) {
        src.shift();
        }
      
      else {
        throw new Error(`Invalid token: ${src[0]}`);
      }
      
    }

    //defines end of file
    yield token("EOF", Ttoken.EndOfFile);
  }

  
  

