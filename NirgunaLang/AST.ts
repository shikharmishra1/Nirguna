import { type } from "os";

export enum AstNodeType {
    Program = "Program",
    BinaryExpression = "BinaryExpression",
    Identifier = "Identifier",
    NumericLiteral = "Literal",
    NullLiteral = "NullLiteral",
    VariableDeclaration = "VariableDeclaration",
    AssignmentExpression = "AssignmentExpression",
    MemberExpression = "MemberExpression",
    CallExpression = "CallExpression",
    Statement = "Statement",
    Property = "Property",
    ObjectLiteral = "ObjectLiteral",
    FunctionDeclaration = "FunctionDeclaration",
    Block="Block"
  }

  export interface AssignmentExpressionNode extends ExpressionNode {
    type: AstNodeType.AssignmentExpression,
    assigne:ExpressionNode,
    value:ExpressionNode,
  }

  export interface StatementNode extends AstNode {
    type: AstNodeType.Statement;
    expression: AstNode;
  }
  export interface AstNode {
    type: AstNodeType;
  }



  export interface FunctionDeclarationNode extends AstNode {
    type: AstNodeType.FunctionDeclaration;
    parameters: string[];
    name:string;
    body: BlockNode;
  }

  export interface BlockNode extends AstNode {
    type: AstNodeType.Block;
    //parameters: string[];
    //name:string;
    body: AstNode[];
  }
  
  export interface ProgramNode extends AstNode {
    type: AstNodeType.Program;
    body: AstNode[];
  }
  
  export interface BinaryExpressionNode extends ExpressionNode {
    type: AstNodeType.BinaryExpression;
    operator: string;
    left: ExpressionNode;
    right: ExpressionNode;
  } 

  export interface CallExpressionNode extends ExpressionNode {
    type: AstNodeType.CallExpression;
    params: ExpressionNode[];
    caller: ExpressionNode;
    
  }
  export interface ExpressionNode extends AstNode {}

  export interface MemberExpressionNode extends ExpressionNode {
    type: AstNodeType.MemberExpression;
    object: ExpressionNode;
    property: ExpressionNode;
    isComputed: boolean;
    
  }

  export interface PropertyNode extends ExpressionNode {
    type: AstNodeType.Property;
    key:string;
    value?:AstNode
  }
  export interface ObjectLiteralNode extends ExpressionNode {
    type: AstNodeType.ObjectLiteral;
    properties:PropertyNode[];
    
  }

  export interface IdentifierNode extends ExpressionNode {
    type: AstNodeType.Identifier;
    name: string;
  }
  
  export interface NumericLiteralNode extends ExpressionNode {
    type: AstNodeType.NumericLiteral;
    value: number;
  }

  export interface NullLiteralNode extends ExpressionNode {
    type: AstNodeType.NullLiteral;
    value: "निर्गुण";
  }

  export interface VariableDeclarationNode extends AstNode {
    type: AstNodeType.VariableDeclaration;
    isConstant: boolean;
    name: string;
    value?: ExpressionNode;
  }
  