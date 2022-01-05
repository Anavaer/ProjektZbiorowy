import React from 'react';
import { UserItem } from './user-item';
import {render, fireEvent, screen} from '@testing-library/react'

describe('UserItem tests', () => {
  it('UserItem renders correctly', () => {
    const mockHandleUserDetails = jest.fn();
    render(<UserItem user={{ firstName: 'Adam', lastName: 'Test', id: 1, roles: ['Client'] }} handleUserDetails={mockHandleUserDetails}/>)

    expect(screen.getByRole('user-item-person-details')).toHaveTextContent('Adam Test');
    expect(screen.getByRole('user-item-person-role')).toHaveTextContent('Klient');
    expect(screen.getByRole('user-item-details-button')).toBeDefined();
  });

  it('When UserDetails button is pressed handleUserDetails function is called', () => {
    const mockHandleUserDetails = jest.fn();
    render(<UserItem user={{ firstName: 'Adam', lastName: 'Test', id: 1, roles: ['Client'] }} handleUserDetails={mockHandleUserDetails}/>)

    fireEvent.click(screen.getByText('Szczegóły'))

    expect(mockHandleUserDetails).toBeCalled();
  });
})
