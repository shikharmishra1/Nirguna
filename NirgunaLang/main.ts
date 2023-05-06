import {parse} from './parser'
import * as readline from 'readline';
import {evaluate} from './runtime/interpretor'
import Environment from './runtime/environment';
import { MK_BOOL, MK_NUMBER, NumericValueNode, ValueNodeType } from './runtime/values';

const env = new Environment

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
