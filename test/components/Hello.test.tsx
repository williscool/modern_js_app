// src/components/Hello.test.tsx

/**
 * Test hello
 */

import * as Enzyme from "enzyme";
import * as enzymeAdapterReact16 from "enzyme-adapter-react-16";
import * as React from "react";
import { Hello } from "../../src/components/Hello";

Enzyme.configure({ adapter: new enzymeAdapterReact16() });

it("renders the correct text when no enthusiasm level is given", () => {
  const hello = Enzyme.shallow(<Hello name="Daniel" />);
  expect(hello.find(".greeting").text()).toEqual("Hello from Daniel!");
});

it("renders the correct text with an explicit enthusiasm of 1", () => {
  const hello = Enzyme.shallow(<Hello name="Daniel" enthusiasmLevel={1} />);
  expect(hello.find(".greeting").text()).toEqual("Hello from Daniel!");
});

it("renders the correct text with an explicit enthusiasm level of 5", () => {
  const hello = Enzyme.shallow(<Hello name="Daniel" enthusiasmLevel={5} />);
  expect(hello.find(".greeting").text()).toEqual("Hello from Daniel!!!!!");
});

it("throws when the enthusiasm level is 0", () => {
  expect(() => {
    Enzyme.shallow(<Hello name="Daniel" enthusiasmLevel={0} />);
  }).toThrow();
});

it("throws when the enthusiasm level is negative", () => {
  expect(() => {
    Enzyme.shallow(<Hello name="Daniel" enthusiasmLevel={-1} />);
  }).toThrow();
});
