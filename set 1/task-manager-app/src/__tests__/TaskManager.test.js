import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import TaskManager from '../TaskManager';
import { API_BASE_URL } from '../config/api';

// Mock fetch
global.fetch = jest.fn();

describe('TaskManager', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('filters tasks by priority', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', deadline: '2025-05-25T10:00:00', priority: 'high' },
      { id: 2, title: 'Task 2', deadline: '2025-05-21T15:30:00', priority: 'medium' },
      { id: 3, title: 'Task 3', deadline: '2025-05-28T12:00:00', priority: 'low' }
    ];

    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTasks)
      })
    );

    await act(async () => {
      render(<TaskManager />);
    });

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Filter by Priority:'), {
        target: { value: 'high' }
      });
    });

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
  });

  // Add more tests as needed
});