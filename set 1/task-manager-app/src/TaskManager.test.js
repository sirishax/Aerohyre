import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskManager from './TaskManager';

describe('TaskManager', () => {
  const mockTasks = [
    { id: 1, title: 'Task 1', deadline: '2025-05-25T10:00:00', priority: 'high' },
    { id: 2, title: 'Task 2', deadline: '2025-05-21T15:30:00', priority: 'medium' },
    { id: 3, title: 'Task 3', deadline: '2025-05-28T12:00:00', priority: 'low' }
  ];

  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTasks)
      })
    );
  });

  test('renders loading state initially', () => {
    render(<TaskManager />);
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  test('renders tasks after loading', async () => {
    render(<TaskManager />);
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });
  });

  test('filters tasks by priority', async () => {
    render(<TaskManager />);
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const filterSelect = screen.getByLabelText('Filter by Priority:');
    fireEvent.change(filterSelect, { target: { value: 'high' } });

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
  });

  test('sorts tasks by urgency score', async () => {
    render(<TaskManager />);
    await waitFor(() => {
      const taskRows = screen.getAllByRole('row');
      // First row is header, so we start from index 1
      expect(taskRows[1]).toHaveTextContent('Task 1');
    });
  });

  test('highlights overdue tasks', async () => {
    const pastTask = [
      { id: 1, title: 'Overdue Task', deadline: '2023-01-01T10:00:00', priority: 'high' }
    ];
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(pastTask)
      })
    );

    render(<TaskManager />);
    await waitFor(() => {
      const taskRow = screen.getByText('Overdue Task').closest('.task-row');
      expect(taskRow).toHaveClass('overdue');
    });
  });
});