
//Ttoken is the datatype
export enum Ttoken
{
    Number = "Number",
    Identifier="Identifier",
    Equals="Equals",
    Comma="Comma",
    OpenParanthesis="OpenParanthesis", CloseParanthesis="CloseParanthesis",
    BinaryOperator="BinaryOperator",
    Variable="Variable",


}


export interface Token
{
    value:string,
    type:Ttoken
}

const KEYWORDS:Record<string, Ttoken> = {
    "परिवर्तनीय":Ttoken.Variable
}



function token(value="", type:Ttoken):Token
{
    return {value, type};
}

function isSkippable(token:string) {
    return token === ' '|| token=== '\n' || token === '\t'
}

function* tokenize(inputCode:string) {
    const src = inputCode.split("");
    const XRegExp = require("xregexp");
    const hindiIdentifierRegex = XRegExp("^\\p{Devanagari}[_\\p{Devanagari}\\d]*$");
    while (src.length > 0) {
      if (src[0] === "(") {
        yield token(src.shift(), Ttoken.OpenParanthesis);
      } else if (src[0] === ")") {
        yield token(src.shift(), Ttoken.CloseParanthesis);
      } else if (src[0] === "=") {
        yield token(src.shift(), Ttoken.Equals);
      } else if (["+","-","*","/"].includes(src[0])) {
        yield token(src.shift(), Ttoken.BinaryOperator);
      } else if (/^\d+$/.test(src[0])) {
        yield token(src.shift(), Ttoken.Number);
      } else if(src[0]===','){
        yield token(src.shift(), Ttoken.Comma);
      }
       else if (hindiIdentifierRegex.test(src[0])) {
        let identifier = "";
        while (src.length > 0 && hindiIdentifierRegex.test(src[0])) {
          identifier += src.shift();
        }
        if (KEYWORDS[identifier]) {
          yield token(identifier, Ttoken.Variable);
        } else {
          yield token(identifier, Ttoken.Identifier);
        }
      } 
      else if (isSkippable(src[0])) {
        src.shift();
    }
      
      else {
        throw new Error(`Invalid token: ${src[0]}`);
      }
    }
  }
  
const inputCode = "गणित परिवर्तनीय की विधियाँ (संख्या एक, संख्या दो)";
for (const token of tokenize(inputCode)) {
  console.log(token);
}
