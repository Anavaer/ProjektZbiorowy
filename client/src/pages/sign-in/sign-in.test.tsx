import React from 'react';
import renderer from 'react-test-renderer';
import { SignIn } from 'pages';
import { BrowserRouter } from "react-router-dom";

it('SignIn renders correctly', () => {
  const tree = renderer
    .create(<BrowserRouter><SignIn/></BrowserRouter>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});