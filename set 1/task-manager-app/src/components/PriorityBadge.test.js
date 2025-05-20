import { render, screen } from '@testing-library/react';
import PriorityBadge from './PriorityBadge';

describe('PriorityBadge', () => {
  test('renders high priority badge correctly', () => {
    render(<PriorityBadge priority="high" />);
    const badge = screen.getByText('HIGH');
    expect(badge).toHaveClass('badge-high');
  });

  test('renders medium priority badge correctly', () => {
    render(<PriorityBadge priority="medium" />);
    const badge = screen.getByText('MEDIUM');
    expect(badge).toHaveClass('badge-medium');
  });

  test('renders low priority badge correctly', () => {
    render(<PriorityBadge priority="low" />);
    const badge = screen.getByText('LOW');
    expect(badge).toHaveClass('badge-low');
  });
});