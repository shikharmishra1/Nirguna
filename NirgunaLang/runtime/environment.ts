import { ok } from 'assert';
import {MK_BOOL, MK_NULL, MK_Native_FN, ValueNode} from './values'

export function createGlobalScope()
    {
        const env = new Environment();
        env.declare("सत्य", MK_BOOL(true), true);
        env.declare("असत्य", MK_BOOL(true), false);

        //define native functions
        env.declare("लेख", MK_Native_FN((params, scope)=>
        {   
            console.log(...params);
            return MK_NULL();
        }), true);
        return env
    }

export default class Environment{
    private parent?:Environment;
    private variables:Map<string, ValueNode>;
    private constants:Set<string>

    constructor(parentEnv?:Environment)
    {
        const global = parentEnv? true:false;
        this.parent = parentEnv;
        this.variables = new Map();
        this.constants = new Set();
        
    }

    

    //declares variable
    public declare(name:string, value:ValueNode, isConstant:boolean): ValueNode
    {
        if(this.variables.has(name))
        {
            throw 'मान '+{name}+' पहले से ही परिभाषित है इसलिए उसे दोबारा घोषित नहीं किया जा सकता।'
        }
        if(isConstant)
          this.constants.add(name);
        this.variables.set(name, value)
        return value;
    }

    public assign(name:string, value:ValueNode):ValueNode
    {
        const env = this.resolve(name);

        //can't assign to a constant
        if(this.constants.has(name))
            throw "नित्य मान "+{name}+" को पुनर्नियत नहीं किया जा सकता"

        env.variables.set(name, value);
        return value
    }

    //traverse the scope of environment
    public resolve(name:string):Environment
    {
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

    public lookup(name:string):ValueNode
    {
        const env = this.resolve(name);
        return env.variables.get(name) as ValueNode
    }


}