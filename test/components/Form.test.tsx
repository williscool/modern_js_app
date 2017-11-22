// src/components/Hello.test.tsx

/**
 * Tests form
 *
 * Testing the overall sturcture of the form would be covered by the snapshot test
 *
 * So no need to test like where the actions are in the form or if they are all listed.
 *
 * But there is special logic to hide a currency based on if its in the quote or base currency field
 *
 * I think that is worth testing.
 *
 * Also I will seperately test the validation logic in more of a unit test as well
 *
 */

import * as Enzyme from "enzyme";
import * as enzymeAdapterReact16 from "enzyme-adapter-react-16";
import MenuItem from "material-ui/MenuItem";
import * as React from "react";
import { Curriences, Form } from "../../src/components/Form";

Enzyme.configure({ adapter: new enzymeAdapterReact16() });

it("renders without error period", () => {
  const form = Enzyme.shallow(<Form />);
  expect(form.find("form")).toBeDefined();
});

it("renders correctly", () => {
  const form = Enzyme.shallow(<Form />);
  expect(form).toMatchSnapshot();
});

it("renders correct menu items for currency selectfields", () => {
  // why this doesn't work as expected https://github.com/airbnb/enzyme/issues/252
  // left for the spirit of whats here

  const form = Enzyme.shallow(<Form />);
  // const numCurrencyTypes = Object.keys(Curriences).length;
  const baseSelect = form.find(".base");
  const quoteSelect = form.find(".quote");

  const baseMenuItems = baseSelect.find(<MenuItem />);
  const quoteMenuItems = quoteSelect.find(<MenuItem />);

  // expect one less menuitem than there are currencies
  // expect(baseMenuItems.length).toBe(numCurrencyTypes - 1);
  // expect(quoteMenuItems.length).toBe(numCurrencyTypes - 1);

  // On load BTC is the default quote currency.
  // So we want to test that the base select CANNOT BE set to BTC
  expect(
    baseMenuItems.filter((mi: MenuItem) => mi.props.value === Curriences.BTC)
      .length
  ).toBe(0);

  // On load USD is the default base currency.
  // So we want to test that the quote select CANNOT BE set to USD
  expect(
    quoteMenuItems.filter((mi: MenuItem) => mi.props.value === Curriences.USD)
      .length
  ).toBe(0);

  // you could also test that simulating a change properly updates the menu items as well
});
