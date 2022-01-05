import React from 'react';
// @ts-ignore
import renderer from 'react-test-renderer';
import { SignIn } from 'pages';
import { BrowserRouter } from "react-router-dom";

describe("SignIn tests", () => {
  it('SignIn renders correctly', () => {
    const tree = renderer
      .create(<BrowserRouter><SignIn/></BrowserRouter>)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
})
