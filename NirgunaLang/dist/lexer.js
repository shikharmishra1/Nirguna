"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.Ttoken = void 0;
//type of token
var Ttoken;
(function (Ttoken) {
    Ttoken["Identifier"] = "Identifier";
    Ttoken["Equals"] = "Equals";
    Ttoken["Comma"] = "Comma";
    Ttoken["OpenParanthesis"] = "OpenParanthesis";
    Ttoken["CloseParanthesis"] = "CloseParanthesis";
    Ttoken["OpenBrace"] = "OpenBrace";
    Ttoken["CloseBrace"] = "CloseBrace";
    Ttoken["OpenBracket"] = "OpenBracket";
    Ttoken["CloseBracket"] = "CloseBracket";
    Ttoken["Colon"] = "Colon";
    Ttoken["BinaryOperator"] = "BinaryOperator";
    Ttoken["Number"] = "Number";
    Ttoken["EndOfFile"] = "EndOfFile";
    Ttoken["PurnaViraam"] = "PurnaViraam";
    //operators
    Ttoken["ConditionalOperator"] = "Conditional Operator";
    Ttoken["DotOperator"] = "Dot Operator";
    //keywords
    Ttoken["Constant"] = "Constant";
    Ttoken["Variable"] = "Variable";
    Ttoken["Null"] = "Null";
    Ttoken["Function"] = "Function";
})(Ttoken = exports.Ttoken || (exports.Ttoken = {}));
const hindiToStandardDigits = {
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
function convertHindiToStandardDigits(str) {
    return str.replace(/[०-९]/g, (match) => hindiToStandardDigits[match]);
}
//defines keywords in the language
const KEYWORDS = {
    मान: Ttoken.Variable,
    निर्गुण: Ttoken.Null,
    नित्य: Ttoken.Constant,
    कर्म: Ttoken.Function,
};
function token(value = "", type) {
    return { value, type };
}
function isSkippable(token) {
    return token === " " || token === "\n" || token === "\t" || token === "\r";
}
function* tokenize(inputCode) {
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
        }
        else if (src[0] === ")") {
            yield token(src.shift(), Ttoken.CloseParanthesis);
        }
        else if (src[0] === "{") {
            yield token(src.shift(), Ttoken.OpenBrace);
        }
        else if (src[0] === "}") {
            yield token(src.shift(), Ttoken.CloseBrace);
        }
        else if (["+", "-", "*", "/", "%"].includes(src[0])) {
            yield token(src.shift(), Ttoken.BinaryOperator);
        }
        else if (["<", "<=", ">=", "==", ">"].includes(src[0])) {
            yield token(src.shift(), Ttoken.ConditionalOperator);
        }
        else if (src[0] === ".") {
            yield token(src.shift(), Ttoken.DotOperator);
        }
        else if (src[0] === "।") {
            yield token(src.shift(), Ttoken.PurnaViraam);
        }
        else if (["+", "-", "*", "/", "%"].includes(src[0])) {
            yield token(src.shift(), Ttoken.BinaryOperator);
        }
        else if (src[0] === '=') {
            yield token(src.shift(), Ttoken.Equals);
        }
        else if (src[0] === ',') {
            yield token(src.shift(), Ttoken.Comma);
        }
        else if (src[0] === ':') {
            yield token(src.shift(), Ttoken.Colon);
        }
        else if (src[0] === '[') {
            yield token(src.shift(), Ttoken.OpenBracket);
        }
        else if (src[0] === ']') {
            yield token(src.shift(), Ttoken.CloseBracket);
        }
        //handles identifiers and keywords
        else if (hindiIdentifierRegex.test(src[0]) && !(/[०-९]/g.test(src[0]))) {
            let identifier = "";
            while (src.length > 0 && hindiIdentifierRegex.test(src[0])) {
                identifier += src.shift();
            }
            if (KEYWORDS[identifier] !== undefined) {
                yield token(identifier, KEYWORDS[identifier]);
            }
            else {
                yield token(identifier, Ttoken.Identifier);
            }
        }
        //skips comments
        //handles numbers
        else if (/^[\d.]+$/.test(convertHindiToStandardDigits(src[0]))) {
            let num = "";
            while (src.length > 0 && /^[\d.]$/.test(convertHindiToStandardDigits(src[0]))) {
                num += convertHindiToStandardDigits(src.shift() ?? "");
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
exports.tokenize = tokenize;
