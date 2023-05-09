"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGlobalScope = void 0;
const values_1 = require("./values");
function createGlobalScope() {
    const env = new Environment();
    env.declare("सत्य", (0, values_1.MK_BOOL)(true), true);
    env.declare("असत्य", (0, values_1.MK_BOOL)(true), false);
    //define native functions
    env.declare("लेख", (0, values_1.MK_Native_FN)((params, scope) => {
        console.log(...params);
        return (0, values_1.MK_NULL)();
    }), true);
    return env;
}
exports.createGlobalScope = createGlobalScope;
class Environment {
    constructor(parentEnv) {
        const global = parentEnv ? true : false;
        this.parent = parentEnv;
        this.variables = new Map();
        this.constants = new Set();
    }
    //declares variable
    declare(name, value, isConstant) {
        if (this.variables.has(name)) {
            throw 'मान ' + { name } + ' पहले से ही परिभाषित है इसलिए उसे दोबारा घोषित नहीं किया जा सकता।';
        }
        if (isConstant)
            this.constants.add(name);
        this.variables.set(name, value);
        return value;
    }
    assign(name, value) {
        const env = this.resolve(name);
        //can't assign to a constant
        if (this.constants.has(name))
            throw "नित्य मान " + { name } + " को पुनर्नियत नहीं किया जा सकता";
        env.variables.set(name, value);
        return value;
    }
    //traverse the scope of environment
    resolve(name) {
        //returns current environment if it has the variable
        if (this.variables.has(name)) {
            return this;
        }
        //no parent? then the var doesn't exist
        if (this.parent == undefined) {
            throw `${name} मौजूद नहीं है इसलिए उसे संकलित नहीं किया जा सकता।`;
        }
        //parent exists? resolve that recursively 
        return this.parent.resolve(name);
    }
    lookup(name) {
        const env = this.resolve(name);
        return env.variables.get(name);
    }
}
exports.default = Environment;
