import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeadersEditor } from './HeadersEditor';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
}));

// Mock atoms
vi.mock('@/ui/atoms/button/button', () => ({
  Button: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

vi.mock('@/ui/atoms/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock('@/ui/atoms/label', () => ({
  Label: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode;
    htmlFor?: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
}));

describe('HeadersEditor', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state', () => {
    render(<HeadersEditor onChange={mockOnChange} />);
    expect(screen.getByText('headersOptional')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('headerKeyPlaceholder')
    ).not.toBeInTheDocument();
  });

  it('renders initial headers from value', () => {
    const initialValue = JSON.stringify({ 'Content-Type': 'application/json' });
    render(<HeadersEditor value={initialValue} onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('Content-Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('application/json')).toBeInTheDocument();
  });

  it('adds a new header when plus button is clicked', () => {
    render(<HeadersEditor onChange={mockOnChange} />);

    // Click plus button
    const addButton = screen.getByTestId('plus-icon').closest('button');
    if (addButton) fireEvent.click(addButton);

    expect(screen.getAllByLabelText('headerKey')).toHaveLength(1);
    expect(screen.getAllByLabelText('headerValue')).toHaveLength(1);
  });

  it('removes a header when trash button is clicked', () => {
    const initialValue = JSON.stringify({ Key1: 'Val1' });
    render(<HeadersEditor value={initialValue} onChange={mockOnChange} />);

    const removeButton = screen.getByTestId('trash-icon').closest('button');
    if (removeButton) fireEvent.click(removeButton);

    expect(mockOnChange).toHaveBeenCalledWith(undefined);
    expect(screen.queryByLabelText('headerKey')).not.toBeInTheDocument();
  });

  it('calls onChange when key or value changes', () => {
    render(<HeadersEditor onChange={mockOnChange} />);

    // Add one header
    const addButton = screen.getByTestId('plus-icon').closest('button');
    if (addButton) fireEvent.click(addButton);

    const keyInput = screen.getByLabelText('headerKey');
    const valueInput = screen.getByLabelText('headerValue');

    fireEvent.change(keyInput, { target: { value: 'Authorization' } });
    fireEvent.change(valueInput, { target: { value: 'Bearer token' } });

    expect(mockOnChange).toHaveBeenLastCalledWith(
      JSON.stringify({ Authorization: 'Bearer token' })
    );
  });
});
