import {ValueNode} from './values'

export default class Environment{
    private parent?:Environment;
    private variables:Map<string, ValueNode>;

    constructor(parentEnv?:Environment)
    {
        this.parent = parentEnv;
        this.variables = new Map();
    }

    //declares variable
    public declare(name:string, value:ValueNode): ValueNode
    {
        if(this.variables.has(name))
        {
            throw 'मान '+{name}+' पहले से ही परिभाषित है इसलिए उसे दोबारा घोषित नहीं किया जा सकता।'
        }
        this.variables.set(name, value)
        return value;
    }

    public assign(name:string, value:ValueNode):ValueNode
    {
        const env = this.resolve(name);
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
            throw ''+{name}+'मौजूद नहीं है इसलिए उसे संकलित नहीं किया जा सकता।';
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