import { render } from '@testing-library/preact';
import { describe, it, expect } from 'vitest';
import { About } from './About.tsx';

describe('About', () => {
  it('renders the heading and description', () => {
    const { getByText } = render(<About />);

    expect(getByText('Blind Keeper')).toBeInTheDocument();
    expect(getByText(/companion tracker for Balatro/)).toBeInTheDocument();
  });

  it('renders a link to the GitHub repo', () => {
    const { getByText } = render(<About />);

    const link = getByText('View on GitHub');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com/bwyatt/blind-keeper');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
