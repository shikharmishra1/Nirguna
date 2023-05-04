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
  
  export interface BooleanLiteralNode extends ValueNode {
    type: ValueNodeType.BooleanLiteral;
    value: boolean;
  }
  
  export interface StringLiteralNode extends ValueNode {
    type: ValueNodeType.StringLiteral;
    value: string;
  }
  