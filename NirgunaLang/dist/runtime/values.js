"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MK_Native_FN = exports.MK_NULL = exports.MK_BOOL = exports.MK_NUMBER = exports.ValueNodeType = void 0;
var ValueNodeType;
(function (ValueNodeType) {
    ValueNodeType["BinaryExpression"] = "BinaryExpression";
    ValueNodeType["Identifier"] = "Identifier";
    ValueNodeType["NumericLiteral"] = "NumericLiteral";
    ValueNodeType["NullLiteral"] = "NullLiteral";
    ValueNodeType["VariableDeclaration"] = "VariableDeclaration";
    ValueNodeType["Statement"] = "Statement";
    ValueNodeType["FunctionDeclaration"] = "FunctionDeclaration";
    ValueNodeType["ObjectLiteral"] = "ObjectLiteral";
    ValueNodeType["BooleanLiteral"] = "BooleanLiteral";
    ValueNodeType["StringLiteral"] = "StringLiteral";
    ValueNodeType["NativeFunctions"] = "NativeFunctions";
})(ValueNodeType = exports.ValueNodeType || (exports.ValueNodeType = {}));
function MK_NUMBER(num) {
    return {
        type: ValueNodeType.NumericLiteral,
        value: num
    };
}
exports.MK_NUMBER = MK_NUMBER;
function MK_BOOL(bool) {
    return {
        type: ValueNodeType.BooleanLiteral,
        value: bool
    };
}
exports.MK_BOOL = MK_BOOL;
function MK_NULL(str) {
    return {
        type: ValueNodeType.NullLiteral,
        value: "निर्गुण"
    };
}
exports.MK_NULL = MK_NULL;
function MK_Native_FN(call) {
    return {
        type: ValueNodeType.NativeFunctions,
        call: call
    };
}
exports.MK_Native_FN = MK_Native_FN;
