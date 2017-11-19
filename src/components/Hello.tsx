import * as React from "react";

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

function Hello({ name, enthusiasmLevel = 1 }: Props) {
  if (enthusiasmLevel <= 0) {
    throw new Error("You could be a little more enthusiastic. :D");
  }

  return (
    <div className="hello">
      <h1 className="greeting">
        Hello from {name + getExclamationMarks(enthusiasmLevel)}
      </h1>
    </div>
  );
}

// helpers

function getExclamationMarks(numChars: number) {
  return Array(numChars + 1).join("!");
}

export default Hello;
