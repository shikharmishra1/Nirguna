export enum AstNodeType {
    Program = "Program",
    BinaryExpression = "BinaryExpression",
    Identifier = "Identifier",
    NumericLiteral = "Literal",
    NullLiteral = "NullLiteral",
    VariableDeclaration = "VariableDeclaration",
    Statement = "Statement",
    
  }

  export interface StatementNode extends AstNode {
    type: AstNodeType.Statement;
    expression: AstNode;
  }
  export interface AstNode {
    type: AstNodeType;
  }
  
  export interface ProgramNode extends AstNode {
    type: AstNodeType.Program;
    body: AstNode[];
  }
  
  export interface BinaryExpressionNode extends AstNode {
    type: AstNodeType.BinaryExpression;
    operator: string;
    left: AstNode;
    right: AstNode;
  }
  
  export interface IdentifierNode extends AstNode {
    type: AstNodeType.Identifier;
    name: string;
  }
  
  export interface NumericLiteralNode extends AstNode {
    type: AstNodeType.NumericLiteral;
    value: number;
  }

  export interface NullLiteralNode extends AstNode {
    type: AstNodeType.NullLiteral;
    value: "निर्गुण";
  }

  export interface VariableDeclarationNode extends AstNode {
    type: AstNodeType.VariableDeclaration;
    isConstant: boolean;
    name: string;
    value?: AstNode;
  }
  