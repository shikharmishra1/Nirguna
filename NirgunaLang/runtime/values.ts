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
  
  export interface FunctionDeclarationNode extends ValueNode {
    type: ValueNodeType.FunctionDeclaration;
    name: string;
    params: string[];
    body: ValueNode[];
  }
  
  export interface ObjectLiteralNode extends ValueNode {
    type: ValueNodeType.ObjectLiteral;
    properties: { key: string; value: ValueNode }[];
  }
  
  export interface BooleanValueNode extends ValueNode {
    type: ValueNodeType.BooleanLiteral;
    value: boolean;
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
  export function MK_BOOL(bool:boolean):BooleanValueNode
  {
      return {
          type: ValueNodeType.BooleanLiteral,
          value:bool
      } as BooleanValueNode;
  }
  export function MK_NULL(str:boolean):NullValueNode
  {
      return {
          type: ValueNodeType.NullLiteral,
          value:"निर्गुण"
      } as NullValueNode;
  }
  