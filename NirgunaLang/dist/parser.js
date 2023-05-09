"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const lexer_1 = require("./lexer");
const AST_1 = require("./AST");
function parse(inputCode) {
    let tokens = [...(0, lexer_1.tokenize)(inputCode)];
    //determines if parser have reached the end of the file
    function notEOF() {
        return tokens[0].type != lexer_1.Ttoken.EndOfFile;
    }
    //return previous token and advances to next one
    function advance() {
        const previousToken = tokens.shift();
        return previousToken;
    }
    function expect(type, error) {
        const previousToken = tokens.shift();
        if (!previousToken || previousToken.type != type) {
            console.error("Parser Error:\n", error, previousToken, " - Expecting: ", type);
        }
        return previousToken;
    }
    function parseStatement() {
        switch (tokens[0].type) {
            default:
                return parseExpression();
            case lexer_1.Ttoken.Variable:
            case lexer_1.Ttoken.Constant:
                return parseVariableDeclaration();
            case lexer_1.Ttoken.Function:
                return parseFunctionDeclaration();
        }
    }
    function parseExpression() {
        //return the expression lowest in the precedence
        return parseAsignmentExpression();
    }
    function parseAdditiveExpression() {
        //
        let left = parseMultiplicativeExpression();
        while (tokens[0].value == "+" || tokens[0].value == "-") {
            const operator = advance().value;
            const right = parseMultiplicativeExpression();
            left = {
                type: AST_1.AstNodeType.BinaryExpression,
                operator: operator,
                left,
                right,
            };
        }
        return left;
    }
    function parseMultiplicativeExpression() {
        //parse the expression with the highest precedence
        let left = parseCallMemberExpression();
        while (tokens[0].value == "*" || tokens[0].value == "/" || tokens[0].value == "%") {
            const operator = advance().value;
            const right = parseCallMemberExpression();
            left = {
                type: AST_1.AstNodeType.BinaryExpression,
                operator: operator,
                left,
                right,
            };
        }
        return left;
    }
    function parsePrimaryExpression() {
        const token = tokens[0].type;
        switch (token) {
            // User defined values.
            case lexer_1.Ttoken.Identifier:
                return { type: AST_1.AstNodeType.Identifier, name: advance().value };
            // Constants and Numeric Constants
            case lexer_1.Ttoken.Number:
                return {
                    type: AST_1.AstNodeType.NumericLiteral,
                    value: parseFloat(advance().value),
                };
            // Grouping Expressions
            case lexer_1.Ttoken.OpenParanthesis: {
                advance(); // advance the opening paren
                const value = parseExpression();
                expect(lexer_1.Ttoken.CloseParanthesis, "Unexpected token found inside parenthesized expression. Expected closing parenthesis."); // closing paren
                return value;
            }
            case lexer_1.Ttoken.Null:
                advance(); // advance the null token
                return {
                    type: AST_1.AstNodeType.NullLiteral,
                    value: "निर्गुण",
                };
            // Unidentified Tokens and Invalid Code Reached
            default:
                throw new Error("Unexpected token found during parsing!" + [tokens[0].type, tokens[0].value]);
        }
    }
    const body = [];
    while (notEOF()) {
        const statement = parseStatement();
        body.push(statement);
    }
    return {
        type: AST_1.AstNodeType.Program,
        body,
    };
    function parseAsignmentExpression() {
        const left = parseObjectExpression();
        if (tokens[0].type == lexer_1.Ttoken.Equals) {
            advance(); //advance past equal token
            const value = parseAsignmentExpression();
            return { value: value, assigne: left, type: AST_1.AstNodeType.AssignmentExpression };
        }
        return left;
    }
    function parseObjectExpression() {
        if (tokens[0].type !== lexer_1.Ttoken.OpenBrace) {
            return parseAdditiveExpression();
        }
        advance(); //advance past open brace
        const properties = new Array();
        // eslint-disable-next-line
        while (notEOF() && tokens.at(0)?.type !== lexer_1.Ttoken.CloseBrace) {
            const key = expect(lexer_1.Ttoken.Identifier, "विशेषण की अपेक्षा थी");
            let token = tokens[0];
            //allows obj = {key,}
            if (token.type === lexer_1.Ttoken.Comma) {
                advance(); //advance past comma
                properties.push({ key: key.value, type: AST_1.AstNodeType.Property });
                continue;
            }
            //allows obj = {key}
            else if (token.type === lexer_1.Ttoken.CloseBrace) {
                advance(); //advance past comma
                properties.push({ key: key.value, type: AST_1.AstNodeType.Property });
                continue;
            }
            //allows {key1:val}
            expect(lexer_1.Ttoken.Colon, ", की अपेक्षा थी");
            const value = parseExpression();
            properties.push({ key: key.value, value: value, type: AST_1.AstNodeType.Property });
            if (tokens.at(0)?.type !== lexer_1.Ttoken.CloseBrace) {
                expect(lexer_1.Ttoken.Comma, ", की अपेक्षा थी");
            }
        }
        expect(lexer_1.Ttoken.CloseBrace, "} की अपेक्षा थी");
        return {
            type: AST_1.AstNodeType.ObjectLiteral,
            properties: properties,
        };
    }
    //type:foo.x()
    function parseCallMemberExpression() {
        const member = parseMemberExpression();
        if (tokens[0].type == lexer_1.Ttoken.OpenParanthesis) {
            return parseCallExpression(member);
        }
        return member;
    }
    function parseCallExpression(caller) {
        let expression = {
            type: AST_1.AstNodeType.CallExpression,
            caller: caller,
            params: parseParams(),
        };
        //this allows chaining of calls like foo.x()()
        if (tokens[0].type == lexer_1.Ttoken.OpenParanthesis) {
            expression = parseCallExpression(expression);
        }
        return expression;
    }
    function parseMemberExpression() {
        let object = parsePrimaryExpression();
        while (tokens[0].type == lexer_1.Ttoken.DotOperator || tokens[0].type == lexer_1.Ttoken.OpenBracket) {
            const operator = advance();
            let property;
            let isComputed;
            //for dot operator (non-computed values)
            if (operator.type == lexer_1.Ttoken.DotOperator) {
                isComputed = false;
                property = parsePrimaryExpression();
                console.log(property);
                if (property.type !== AST_1.AstNodeType.Identifier) {
                    throw 'डॉट संचालक (.) के बाद पहचानकर्ता की अपेक्षा थी।';
                }
            }
            //allows obj[computed Value]
            else {
                isComputed = true;
                property = parseExpression();
                expect(lexer_1.Ttoken.CloseBracket, "] की अपेक्षा थी।");
            }
            object = {
                type: AST_1.AstNodeType.MemberExpression,
                object: object,
                property: property,
            };
        }
        return object;
    }
    function parseParamsList() {
        const params = [parseAsignmentExpression()];
        while (tokens[0].type == lexer_1.Ttoken.Comma && advance()) {
            params.push(parseAsignmentExpression());
        }
        return params;
    }
    function parseParams() {
        expect(lexer_1.Ttoken.OpenParanthesis, "( की अपेक्षा है।");
        const params = tokens[0].type == lexer_1.Ttoken.CloseParanthesis ? [] : parseParamsList();
        expect(lexer_1.Ttoken.CloseParanthesis, ") की अपेक्षा है।");
        return params;
    }
    function parseVariableDeclaration() {
        const isConstant = advance().type == lexer_1.Ttoken.Constant;
        const identifier = expect(lexer_1.Ttoken.Identifier, "मान की घोषणा के बाद पहचानकर्ता के नाम की अपेक्षा है।").value;
        //type: मान एक । or नित्य एक।
        if (tokens[0].type == lexer_1.Ttoken.PurnaViraam) {
            advance();
            if (isConstant) {
                throw "नित्य मान की घोषणा के बाद एक मान की अपेक्षा है। जैसे कि: नित्य एक = १ ।";
            }
            return {
                type: AST_1.AstNodeType.VariableDeclaration,
                name: identifier,
                isConstant: false,
            };
        }
        //type: मान एक = १ ।
        expect(lexer_1.Ttoken.Equals, "मान की घोषणा के बाद एक मान की अपेक्षा है। जैसे कि: मान एक = १ ।");
        const declaration = {
            isConstant: isConstant,
            name: identifier,
            value: parseExpression(),
            type: AST_1.AstNodeType.VariableDeclaration,
        };
        expect(lexer_1.Ttoken.PurnaViraam, "मान की घोषणा के बाद पूर्णविराम (।) की अपेक्षा है। जैसे कि: मान एक = १ ।");
        return declaration;
    }
    function parseFunctionDeclaration() {
        advance(); //skips प्रगट keyword
        const name = expect(lexer_1.Ttoken.Identifier, "कर्म शब्द के बाद कर्म के नाम की अपेछा थी ").value;
        const args = parseParams();
        const params = [];
        for (const arg of args) {
            if (arg.type !== AST_1.AstNodeType.Identifier)
                throw "मापक श्रृंखला के प्रकार के होने चाहिए। जैसे कि: कर्म जोड़(एक,दो) ।" + arg;
            params.push(arg.name);
        }
        const body = parseBlockExpression();
        const fxn = { body: body, name: name, parameters: params, type: AST_1.AstNodeType.FunctionDeclaration };
        return fxn;
    }
    function parseBlockExpression() {
        expect(lexer_1.Ttoken.OpenBrace, "{ की अपेछा थी");
        const body = [];
        while (tokens[0].type !== lexer_1.Ttoken.CloseBrace && tokens[0].type !== lexer_1.Ttoken.EndOfFile)
            body.push(parseStatement());
        expect(lexer_1.Ttoken.CloseBrace, "} की अपेछा थी");
        return body;
    }
}
exports.parse = parse;
