import React from 'react';
// @ts-ignore
import renderer from 'react-test-renderer';
import { SignUp } from 'pages';

describe("SignUp tests", () => {
  it('SignUp renders correctly', () => {
    const tree = renderer
      .create(<SignUp/>)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
})
