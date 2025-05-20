import { render, screen } from '@testing-library/react';
import UrgencyIndicator from './UrgencyIndicator';

describe('UrgencyIndicator', () => {
  test('shows Critical for negative scores', () => {
    render(<UrgencyIndicator score={-1} />);
    expect(screen.getByText('Critical')).toHaveClass('urgency critical');
  });

  test('shows Urgent for scores < 1', () => {
    render(<UrgencyIndicator score={0.5} />);
    expect(screen.getByText('Urgent')).toHaveClass('urgency urgent');
  });

  test('shows High for scores < 3', () => {
    render(<UrgencyIndicator score={2} />);
    expect(screen.getByText('High')).toHaveClass('urgency high');
  });

  test('shows Medium for scores < 7', () => {
    render(<UrgencyIndicator score={5} />);
    expect(screen.getByText('Medium')).toHaveClass('urgency medium');
  });

  test('shows Low for scores >= 7', () => {
    render(<UrgencyIndicator score={8} />);
    expect(screen.getByText('Low')).toHaveClass('urgency low');
  });
});