import { AstNode, BlockNode } from "../AST";
import Environment from "./environment";

export enum ValueNodeType {
    BinaryExpression = "BinaryExpression",
    Identifier = "Identifier",
    NumericLiteral = "NumericLiteral",
    NullLiteral = "NullLiteral",
    VariableDeclaration = "VariableDeclaration",
    Statement = "Statement",
    FunctionDeclaration = "FunctionDeclaration",
    ObjectLiteral = "ObjectLiteral",
    BooleanLiteral = "BooleanLiteral",
    StringLiteral = "StringLiteral",
    NativeFunctions = "NativeFunctions",
    Block = "Block",
    ConditionalStatement = "ConditionalStatement",
    Array = "Array", 
  }
  
  export interface ValueNode {
    type: ValueNodeType;
  }
  
  export interface NumericValueNode extends ValueNode {
    type: ValueNodeType.NumericLiteral;
    value: number;
  }



 
  
  export interface NullValueNode extends ValueNode {
    type: ValueNodeType.NullLiteral;
    value: string;
  }
  
  export interface StringValueNode extends ValueNode {
    type: ValueNodeType.StringLiteral,
    value:string
  }

  export interface ArrayValueNode extends ValueNode {
    type: ValueNodeType.Array,
    value:Array<ValueNode>
  }

  
  
  export interface ObjectLiteralNode extends ValueNode {
    type: ValueNodeType.ObjectLiteral;
    properties: { key: string; value: ValueNode }[];
  }
  
  export interface BooleanValueNode extends ValueNode {
    type: ValueNodeType.BooleanLiteral;
    value: boolean;
  }

  export interface ConditionalValueNode extends ValueNode {
    type: ValueNodeType.ConditionalStatement;
    value:ValueNode[]
  }
  
  export interface StringLiteralNode extends ValueNode {
    type: ValueNodeType.StringLiteral;
    value: string;
  }

  export interface ObjectValueNode extends ValueNode {
    type: ValueNodeType.ObjectLiteral;
    properties:Map<string,ValueNode>;
  }
  
  export interface NullValueNode extends ValueNode {
    type: ValueNodeType.NullLiteral;
    value: string;
  }

  export function MK_NUMBER(num:number):NumericValueNode
  {
      return {
          type: ValueNodeType.NumericLiteral,
          value: num
      } as NumericValueNode;
  }



  export type FunctionCall = (params:ValueNode[], env:Environment) => ValueNode;

  export interface NativeFunctionNode extends ValueNode {
    type: ValueNodeType.NativeFunctions;
    call: FunctionCall;
  }

  export interface FunctionValueNode extends ValueNode
  {
    type:ValueNodeType.FunctionDeclaration
    name:String
    params:string[]
    body:BlockNode
    declarationEnvironment:Environment
  }



  export interface BlockValueNode extends ValueNode
  {
    type:ValueNodeType.Block
    body:AstNode[]
    hasContinue?:boolean
    declarationEnvironment:Environment
  }


  export function MK_BOOL(bool:boolean):BooleanValueNode
  {
      return {
          type: ValueNodeType.BooleanLiteral,
          value:bool
      } as BooleanValueNode;
  }
  export function MK_NULL(str?:boolean):NullValueNode
  {
      return {
          type: ValueNodeType.NullLiteral,
          value:"निर्गुण"
      } as NullValueNode;
  }
  export function MK_Native_FN(call:FunctionCall):NativeFunctionNode
  {
    
      return {
          type: ValueNodeType.NativeFunctions,
          call:call
      } as NativeFunctionNode;
  }
  