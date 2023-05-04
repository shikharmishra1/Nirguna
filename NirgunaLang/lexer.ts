
//type of token
export enum Ttoken
{
    
    Identifier="Identifier",
    Null="Null",
    Equals="Equals",
    Comma="Comma",
    OpenParanthesis="OpenParanthesis", CloseParanthesis="CloseParanthesis",
    BinaryOperator="BinaryOperator",
    Number="Number",
    Variable="Variable",
    EndOfFile="EndOfFile"


}


export interface Token
{
    value:string,
    type:Ttoken
}

//defines keywords in the language
const KEYWORDS:Record<string, Ttoken> = {
    परिवर्तनीय:Ttoken.Variable,
    निर्गुण:Ttoken.Null,
}



function token(value="", type:Ttoken):Token
{
    return {value, type};
}

function isSkippable(token:string) {
    return token === ' '|| token=== '\n' || token === '\t'
}

export function* tokenize(inputCode:string):Generator<Token> {
    const src = inputCode.split("");

    const XRegExp = require("xregexp");

    const hindiIdentifierRegex = XRegExp("^\\p{Devanagari}[_\\p{Devanagari}\\d]*$");

    //tokenizes the input code, yielding tokens one by one to save memory
    while (src.length > 0) {
      if (src[0] === "(") {
        yield token(src.shift(), Ttoken.OpenParanthesis);
      } else if (src[0] === ")") {
        yield token(src.shift(), Ttoken.CloseParanthesis);
      } else if (src[0] === "=") {
        yield token(src.shift(), Ttoken.Equals);
      } else if (["+","-","*","/","%"].includes(src[0])) {
        yield token(src.shift(), Ttoken.BinaryOperator);
      }
       else if(src[0]===','){
        yield token(src.shift(), Ttoken.Comma);
      }
      //handles identifiers and keywords
       else if (hindiIdentifierRegex.test(src[0])) {
        let identifier = "";
        while (src.length > 0 && hindiIdentifierRegex.test(src[0])) {
          identifier += src.shift();
        }
        if (typeof(KEYWORDS[identifier])) {
          yield token(identifier, KEYWORDS[identifier]);
        } else {
          yield token(identifier, Ttoken.Identifier);
        }
        
      }

      //handles numbers
      else if (/^[\d.]+$/.test(src[0])) {
        let num = "";
        while (src.length > 0 && /^\d$/.test(src[0])) {
          num += src.shift();
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
  
  

