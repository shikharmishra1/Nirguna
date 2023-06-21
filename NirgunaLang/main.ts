import {parse} from './parser'
import * as readline from 'readline';
import {evaluate} from './runtime/interpreter'
import Environment, { createGlobalScope } from './runtime/environment';
import fs from 'fs'

import { MK_BOOL, MK_NUMBER, NumericValueNode, ValueNodeType } from './runtime/values';

const env = createGlobalScope();
const args= process.argv.slice(2);

if(args.length == 0)
{
  run();
}
else if(args.length == 1)
{
  const ext = args[0].split('.').pop();
  if(ext == 'nirguna' || ext == 'ng')
    run2(args[0]);
  else
    throw "Invalid file extension use either .nirguna or .ng"
}
else{
 throw "Invalid number of arguments" 
}

function run2 (file:string)
{
  const input =  fs.readFileSync(file, 'utf-8');

  const program = parse(input);
  console.log(JSON.stringify(program, null, 2))
  const result = evaluate(program, env);
  
}

function run() {
  
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
  rl.question(">", function(input) {
    const program = parse(input);
    const result = evaluate(program, env);
   // console.log(JSON.stringify(program, null, 2));
    
    if(!input || input.includes("exit"))
    {
      process.exit(0);
    }
    run();
  });
}


//run();
