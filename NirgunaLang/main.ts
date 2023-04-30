import {parse} from './parser'
import * as readline from 'readline';

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Enter Code: ", function(input) {
    const ast = parse(input);
    console.log(JSON.stringify(ast, null, 2));
    rl.close();
  });


