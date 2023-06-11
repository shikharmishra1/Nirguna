import { ok } from 'assert';
import {ArrayValueNode, MK_BOOL, MK_NULL, MK_Native_FN, NumericValueNode, StringValueNode, ValueNode, ValueNodeType} from './values'

export function createGlobalScope()
    {
        const env = new Environment();
        env.declare("सत्य", MK_BOOL(true), true);
        env.declare("असत्य", MK_BOOL(false),true);

        //define native functions
        env.declare("लेख", MK_Native_FN((params, scope)=>
        {   
            for(let param of params)
            {
                console.log('value' in param? param.value: param.type)
            }
            return MK_NULL();
        }), true);
        env.declare("प्रकार", MK_Native_FN((params, scope)=>
        {   
            if(params.length != 1)
            {
                throw `प्रकार कर्म को केवल एक मापक की अपेछा थी, परंतु मिला ${params.length}`
            }
                return {value:params[0].type} as StringValueNode
        }), true);
        env.declare("पूर्ण", MK_Native_FN((params, scope)=>
        {   
            if(params.length != 4)
            {
                throw `पूर्ण कर्म को केवल २ मापक की अपेछा थी, परंतु मिला ${params.length}`
            }
            if(params[0].type == ValueNodeType.Array )
            {
                let newArray:ValueNode[] = (params[0] as ArrayValueNode).value;
                
                return {type:ValueNodeType.Array, value:newArray} as ArrayValueNode
            }

            throw "सूची की अपेछा थी परंतु मिला "+params[0].type
        }), true);
       
        return env
        
        
    }

export default class Environment{
    public parent?:Environment;
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

    public assign(name:string, value:ValueNode, index?:number):ValueNode
    {
        const env = this.resolve(name);

        //can't assign to a constant
        if(this.constants.has(name))
            throw "नित्य मान "+{name}+" को पुनर्नियत नहीं किया जा सकता"
        if(index)
        {
            
        }

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
    
    //deletes variable from current scope
    public delete(name:string):boolean
    {
        const env = this.resolve(name);
        return env.variables.delete(name)
    }


}