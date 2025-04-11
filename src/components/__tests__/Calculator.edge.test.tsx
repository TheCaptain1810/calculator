import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import Calculator from '../Calculator';

describe('Calculator Edge Cases', () => {
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

  it('should handle dividing by zero', () => {
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<Calculator />);
    fireEvent.click(getNumberButton('5')!);
    fireEvent.click(screen.getByText('÷'));
    fireEvent.click(getNumberButton('0')!);
    fireEvent.click(screen.getByText('='));
    
    // Check that alert was called with the right message
    expect(alertMock).toHaveBeenCalledWith('Cannot divide by zero');
    
    // The display should remain as the first operand
    expect(getDisplayValue()).toBe('5');
    
    // Restore original implementation
    alertMock.mockRestore();
  });

  it('should handle multiple operations in sequence', () => {
    render(<Calculator />);
    fireEvent.click(getNumberButton('2')!);
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(getNumberButton('3')!);
    fireEvent.click(screen.getByText('+'));  // Press + again
    
    // Should compute 2+3 first, displaying 5
    expect(getDisplayValue()).toBe('5');
    
    fireEvent.click(getNumberButton('4')!);
    fireEvent.click(screen.getByText('='));
    
    // Final result should be 9 (5+4)
    expect(getDisplayValue()).toBe('9');
  });

  it('should handle pressing equals without an operator', () => {
    render(<Calculator />);
    fireEvent.click(getNumberButton('7')!);
    fireEvent.click(screen.getByText('='));
    
    // Should still display 7 as no operation was performed
    expect(getDisplayValue()).toBe('7');
  });

  it('should handle pressing equals multiple times', () => {
    render(<Calculator />);
    fireEvent.click(getNumberButton('5')!);
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(getNumberButton('3')!);
    fireEvent.click(screen.getByText('='));
    
    // First equals should give 8
    expect(getDisplayValue()).toBe('8');
    
    // Pressing equals again should not change the result
    fireEvent.click(screen.getByText('='));
    expect(getDisplayValue()).toBe('8');
  });

  it('should handle very large numbers', () => {
    render(<Calculator />);
    
    // Enter a large number by clicking digits
    const nineButton = getNumberButton('9')!;
    for (let i = 0; i < 8; i++) {
      fireEvent.click(nineButton);
    }
    
    // Click multiply
    fireEvent.click(screen.getByText('×'));
    
    // Enter another large number
    for (let i = 0; i < 5; i++) {
      fireEvent.click(nineButton);
    }
    
    // Calculate
    fireEvent.click(screen.getByText('='));
    
    // Should display a large number result
    const displayValue = getDisplayValue();
    expect(displayValue.length).toBeGreaterThan(10);
    expect(Number(displayValue)).toBeGreaterThan(9000000000000);
  });
}); 