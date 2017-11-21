import * as React from "react";

// https://github.com/Microsoft/tslint-microsoft-contrib/issues/339
// tslint:disable:react-unused-props-and-state
export interface Props {
  name: string;
  enthusiasmLevel?: number;
}
// tslint:enable:react-unused-props-and-state

/**
 * Say Hello To My little friend
 *
 * @param {Props} { name, enthusiasmLevel = 1 }
 * @returns {JSX.Element}
 */
// tslint:disable-next-line:function-name
export function Hello({ name, enthusiasmLevel = 1 }: Props): JSX.Element {
  if (enthusiasmLevel <= 0) {
    throw new Error("You could be a little more enthusiastic. :D");
  }

  return (
    <div className="hello">
      <p className="greeting">
        Hello from {name + getExclamationMarks(enthusiasmLevel)}
      </p>
    </div>
  );
}

// helpers

/**
 * Get the number of exclamations!
 *
 * so excited!
 *
 * @param {number} numChars
 * @returns {string}
 */
function getExclamationMarks(numChars: number): string {
  return Array(numChars + 1).join("!");
}
