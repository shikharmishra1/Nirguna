"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ttoken = void 0;
//Ttoken is the datatype
var Ttoken;
(function (Ttoken) {
    Ttoken[Ttoken["Number"] = 0] = "Number";
    Ttoken[Ttoken["Identifier"] = 1] = "Identifier";
    Ttoken[Ttoken["Equals"] = 2] = "Equals";
    Ttoken[Ttoken["OpenParanthesis"] = 3] = "OpenParanthesis";
    Ttoken[Ttoken["CloseParanthesis"] = 4] = "CloseParanthesis";
    Ttoken[Ttoken["BinaryOperator"] = 5] = "BinaryOperator";
    Ttoken[Ttoken["Variable"] = 6] = "Variable";
})(Ttoken = exports.Ttoken || (exports.Ttoken = {}));
const KEYWORDS = {
    "परिवर्तनीय": Ttoken.Variable
};
function token(value = "", type) {
    return { value, type };
}



function* tokenize(inputCode) {
    const src = inputCode.split("");
    const XRegExp = require("xregexp");
    const hindiIdentifierRegex = XRegExp("^\\p{Devanagari}[_\\p{Devanagari}\\d]*$");
    while (src.length > 0) {
        if (src[0] === "(") {
            yield token(src.shift(), Ttoken.OpenParanthesis);
        }
        else if (src[0] === ")") {
            yield token(src.shift(), Ttoken.CloseParanthesis);
        }
        else if (src[0] === "=") {
            yield token(src.shift(), Ttoken.Equals);
        }
        else if (["+", "-", "*", "/"].includes(src[0])) {
            yield token(src.shift(), Ttoken.BinaryOperator);
        }
        else if (/^\d+$/.test(src[0])) {
            yield token(src.shift(), Ttoken.Number);
        }
        else if (hindiIdentifierRegex.test(src[0])) {
            let identifier = "";
            while (src.length > 0 && hindiIdentifierRegex.test(src[0])) {
                identifier += src.shift();
            }
            if (KEYWORDS[identifier]) {
                yield token(identifier, KEYWORDS[identifier]);
            }
            else {
                yield token(identifier, Ttoken.Identifier);
            }
        }
        
        else {
            throw new Error(`Invalid token: ${src[0]}`);
        }

    }
}
const inputCode = "गणित की ";
for (const token of tokenize(inputCode)) {
    console.log(token);
}
//# sourceMappingURL=lexer.js.map