import React from 'react';
import { ServiceItem } from './service-item';
import {render, fireEvent, screen} from '@testing-library/react'

describe('ServiceItem tests', () => {
  it('ServiceItem renders correctly', () => {
    render(<ServiceItem service={{ description: 'Cleaning', priceRatio: 1.4, id: 1 }} />)

    expect(screen.getByRole('service-item-name')).toHaveTextContent('Cleaning');
    expect(screen.getByRole('service-item-price-ratio')).toHaveTextContent('1.4');
    expect(screen.getByRole('service-list-open-dialog-button')).toBeDefined()
  });

  it('ServiceItem editing mode renders correctly', () => {
    render(<ServiceItem service={{ description: 'Cleaning', priceRatio: 1.4, id: 1 }} />)

    fireEvent.click(screen.getByText('Edytuj'))

    expect(screen.getByRole('service-item-input-name')).toBeDefined();
    expect(screen.getByRole('service-item-input-price')).toBeDefined();
    expect(screen.getByRole('service-list-update-button')).toBeDefined()
  });
})
