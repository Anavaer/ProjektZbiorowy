import React from 'react';
import {render, fireEvent, screen, waitFor} from '@testing-library/react'
import {BrowserRouter} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import axios from "axios";
import {UsersList} from "./users-list";

jest.mock("axios");

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('UsersList tests', () => {

  beforeEach(() => {
    mockAxios.get.mockImplementation(() => Promise.resolve({ data: [{"id":1,"firstName":"John","lastName":"Snow","companyName":null,"roles":["Client"]},{"id":2,"firstName":"Greta","lastName":"Green","companyName":null,"roles":["Client"]},{"id":3,"firstName":"Andrew","lastName":"Kloc","companyName":"Build Me Up","roles":["Client"]},{"id":4,"firstName":"Andrew","lastName":"Golota","companyName":"Punch me Sp. z o.o.","roles":["Client"]},{"id":5,"firstName":"Client","lastName":"Lorem","companyName":null,"roles":["Client"]},{"id":6,"firstName":"Arkadiusz","lastName":"Polaczek","companyName":null,"roles":["Client","Worker"]},{"id":7,"firstName":"Worker","lastName":"Ipsum","companyName":null,"roles":["Client","Worker"]},{"id":8,"firstName":"Janusz","lastName":"Wyzyskiwacz","companyName":"Uslugi Sprzatajace Janusz Wyzyskiwacz","roles":["Client","Worker","Administrator"]}] }));
    mockAxios.put.mockImplementation(() => Promise.resolve({ status: 201 }));

    document.cookie = 'role=Administrator';
    document.cookie = 'token=test';
  })

  afterEach(() => {
    mockAxios.get.mockClear();
    mockAxios.put.mockClear();
    document.cookie = "";
  })

  it('UsersList renders correctly', async () => {
    render(<BrowserRouter><CookiesProvider><UsersList /></CookiesProvider></BrowserRouter>)
    await waitFor(() => screen.getAllByRole('user-item'));
    expect(screen.getAllByRole('user-item')).toBeDefined()
  });
})


