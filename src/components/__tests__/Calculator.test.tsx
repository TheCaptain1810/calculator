import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import Calculator from '../Calculator';

describe('Calculator', () => {
  // Helper function to get the display element
  const getDisplayValue = () => {
    const displayElement = document.querySelector('.mb-4.p-3.bg-gray-100.rounded-md.text-right.text-2xl.font-mono.h-14');
    return displayElement?.textContent || '';
  };

  // Helper to get the button by its text content
  const getNumberButton = (number: string) => {
    // Use getAllByText and filter to get only the button (not the display)
    const elements = screen.getAllByText(number);
    return elements.find(el => el.tagName === 'BUTTON');
  };

  it('renders the calculator with initial display of 0', () => {
    render(<Calculator />);
    expect(getDisplayValue()).toBe('0');
  });

  it('updates display when digits are clicked', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('3'));
    expect(getDisplayValue()).toBe('123');
  });

  it('handles decimal point correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('.'));
    fireEvent.click(screen.getByText('2'));
    expect(getDisplayValue()).toBe('5.2');
  });

  it('prevents multiple decimal points', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('.'));
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('.'));
    expect(getDisplayValue()).toBe('1.5');
  });

  it('performs addition correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));
    expect(getDisplayValue()).toBe('10');
  });

  it('performs subtraction correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('9'));
    fireEvent.click(screen.getByText('−'));
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('='));
    expect(getDisplayValue()).toBe('5');
  });

  it('performs multiplication correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('6'));
    fireEvent.click(screen.getByText('×'));
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('='));
    expect(getDisplayValue()).toBe('42');
  });

  it('performs division correctly', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('÷'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('='));
    expect(getDisplayValue()).toBe('4');
  });

  it('clears the display when Clear button is clicked', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('6'));
    expect(getDisplayValue()).toBe('56');
    fireEvent.click(screen.getByText('Clear'));
    expect(getDisplayValue()).toBe('0');
  });

  it('adds calculation to history after pressing equals', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('='));
    
    // Check history
    expect(screen.getByText('3 + 2')).toBeInTheDocument();
    expect(screen.getByText('= 5')).toBeInTheDocument();
  });

  it('clears history when trash icon is clicked', () => {
    render(<Calculator />);
    // Perform a calculation to add to history
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('×'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));
    
    // Verify history exists
    expect(screen.getByText('2 * 3')).toBeInTheDocument();
    
    // Clear history
    fireEvent.click(screen.getByTitle('Clear history'));
    
    // Verify history is cleared
    expect(screen.getByText('No calculations yet')).toBeInTheDocument();
  });

  it('can perform chained operations', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('−'));
    expect(getDisplayValue()).toBe('8');
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('='));
    expect(getDisplayValue()).toBe('6');
  });

  // UI Component Tests
  it('renders calculator title correctly', () => {
    render(<Calculator />);
    expect(screen.getByText('Calculator')).toBeInTheDocument();
  });

  it('renders history title correctly', () => {
    render(<Calculator />);
    expect(screen.getByText('Calculation History')).toBeInTheDocument();
  });

  it('renders digit buttons 0-9', () => {
    render(<Calculator />);
    for (let i = 0; i <= 9; i++) {
      const button = getNumberButton(i.toString());
      expect(button).not.toBeNull();
      expect(button?.tagName).toBe('BUTTON');
    }
  });

  it('renders operator buttons', () => {
    render(<Calculator />);
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '−' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '÷' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '.' })).toBeInTheDocument();
  });

  it('shows the initial "No calculations yet" message in history', () => {
    render(<Calculator />);
    expect(screen.getByText('No calculations yet')).toBeInTheDocument();
  });

  it('has a disabled trash icon when history is empty', () => {
    render(<Calculator />);
    const trashButton = screen.getByTitle('Clear history');
    expect(trashButton).toBeDisabled();
  });
}); 