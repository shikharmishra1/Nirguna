import {parse} from './parser'
import * as readline from 'readline';
import {evaluate} from './runtime/interpretor'
import Environment from './runtime/environment';
import { NumericValueNode, ValueNodeType } from './runtime/values';

const env = new Environment
env.declare('अ', {type:ValueNodeType.NumericLiteral, value:100} as NumericValueNode)

function run() {
  rl.question(">", function(input) {
    const program = parse(input);
    const result = evaluate(program, env);
    console.log(JSON.stringify(program, null, 2));
    console.log(result);
    if(!input || input.includes("exit"))
    {
      process.exit(0);
    }
    run();
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

run();
