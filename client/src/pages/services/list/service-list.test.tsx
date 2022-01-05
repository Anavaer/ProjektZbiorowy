import React from 'react';
import { ServiceList } from './service-list';
import {render, fireEvent, screen, waitFor} from '@testing-library/react'
import {BrowserRouter} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import axios from "axios";

jest.mock("axios");

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('ServiceList tests', () => {

  beforeEach(() => {
    mockAxios.get.mockImplementation(() => Promise.resolve({ data: [{"id":1,"description":"Dusting","priceRatio":1.2}, {"id":2,"description":"Floors","priceRatio":1.8}, {"id":3,"description":"Window Cleaning","priceRatio":2}] }));
    mockAxios.post.mockImplementation(() => Promise.resolve({ status: 201 }));
    mockAxios.put.mockImplementation(() => Promise.resolve({ status: 201 }));

    document.cookie = 'role=Administrator';
    document.cookie = 'token=test';
  })

  afterEach(() => {
    mockAxios.get.mockClear();
    mockAxios.post.mockClear();
    mockAxios.put.mockClear();
    document.cookie = "";
  })

  it('ServiceList renders correctly', async () => {
    render(<BrowserRouter><CookiesProvider><ServiceList /></CookiesProvider></BrowserRouter>)
    await waitFor(() => screen.getAllByRole('service-item'));
    expect(screen.getAllByRole('service-item')).toHaveLength(3);
  });

  it('The dialog to create a new service shows correctly', async () => {
    render(<BrowserRouter><CookiesProvider><ServiceList /></CookiesProvider></BrowserRouter>)

    await waitFor(() => screen.getAllByRole('service-item'));
    fireEvent.click(screen.getByText('Nowa Usługa'))

    expect(screen.getAllByRole('service-list-dialog')).toBeDefined();
  });

  it('Creation of new service is enabled when the name and price is present', async () => {
    render(<BrowserRouter><CookiesProvider><ServiceList /></CookiesProvider></BrowserRouter>)

    await waitFor(() => screen.getAllByRole('service-item'));
    fireEvent.click(screen.getByText('Nowa Usługa'))
    fireEvent.change(screen.getByLabelText('Nazwa Usługi'), {target: {value: 'Cleaning'}})
    fireEvent.change(screen.getByLabelText('Cena Usługi'), {target: {value: '1.4'}})
    expect(screen.getByRole('service-item-create-service-approve')).toBeEnabled();
  });
})


