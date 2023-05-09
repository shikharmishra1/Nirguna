"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const readline = __importStar(require("readline"));
const interpreter_1 = require("./runtime/interpreter");
const environment_1 = require("./runtime/environment");
const fs_1 = __importDefault(require("fs"));
const env = (0, environment_1.createGlobalScope)();
function run2(file) {
    const input = fs_1.default.readFileSync(file, 'utf-8');
    const program = (0, parser_1.parse)(input);
    //console.log(JSON.stringify(program, null, 2))
    const result = (0, interpreter_1.evaluate)(program, env);
    //console.log(result);
}
function run() {
    rl.question(">", function (input) {
        const program = (0, parser_1.parse)(input);
        const result = (0, interpreter_1.evaluate)(program, env);
        console.log(JSON.stringify(program, null, 2));
        if (!input || input.includes("exit")) {
            process.exit(0);
        }
        run();
    });
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
run2('./test/test.nirguna');
//run();
