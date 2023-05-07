
//type of token
export enum Ttoken
{
    
    Identifier="Identifier",
    Equals="Equals",
    Comma="Comma",
    OpenParanthesis="OpenParanthesis", CloseParanthesis="CloseParanthesis",
    BinaryOperator="BinaryOperator",
    Number="Number",
    EndOfFile="EndOfFile",
    PurnaViraam="PurnaViraam",

    //operators
    ConditionalOperator="Conditional Operator",

    //keywords
    Constant="Constant",
    Variable="Variable",
    Null="Null",
    


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
      
      if (skipLine) {
        if (src[0] === "\n") {
          skipLine = false;
        }
        src.shift();
        continue;
      }
      
      if (src[0] === "#") {
        skipLine = true;
        src.shift();
        continue;
      }

      if (src[0] === "(") {
        yield token(src.shift(), Ttoken.OpenParanthesis);
      } else if (src[0] === ")") {
        yield token(src.shift(), Ttoken.CloseParanthesis);
      } else if (["+","-","*","/","%"].includes(src[0])) {
        yield token(src.shift(), Ttoken.BinaryOperator);
      } else if (["<","<=",">=","==",">"].includes(src[0])) {
        yield token(src.shift(), Ttoken.ConditionalOperator);
      }
      
      else if (src[0] === "।") {
        yield token(src.shift(), Ttoken.PurnaViraam);
      } else if (["+","-","*","/","%"].includes(src[0])) {
        yield token(src.shift(), Ttoken.BinaryOperator);
      } else if(src[0]==='='){
        yield token(src.shift(), Ttoken.Equals);
      } 
       else if(src[0]===','){
        yield token(src.shift(), Ttoken.Comma);
      }
       
      //handles identifiers and keywords
       else if (hindiIdentifierRegex.test(src[0]) && !(/[०-९]/g.test(src[0])) ) {
        
        let identifier = "";
        while (src.length > 0 && hindiIdentifierRegex.test(src[0])) {
          identifier += src.shift();
        }
        if (KEYWORDS[identifier]!==undefined) {
          
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

  
  

