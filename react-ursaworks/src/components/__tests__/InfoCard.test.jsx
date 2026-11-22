import { render } from '@testing-library/react';
import InfoCard from '../InfoCard';

// Every label card on the site renders through InfoCard, so the order and
// shape asserted here is the one shared format: heading, label, description.

test('renders heading, then tag, then description', () => {
    const { container } = render(<InfoCard title="Hero" tag="Ground Unit" text="Drives." />);
    const card = container.firstChild;
    expect([...card.children].map((el) => el.tagName)).toEqual(['H3', 'SPAN', 'P']);
    expect(card.children[0]).toHaveTextContent('Hero');
    expect(card.children[1]).toHaveClass('infoCardTag');
    expect(card.children[1]).toHaveTextContent('Ground Unit');
    expect(card.children[2]).toHaveTextContent('Drives.');
});

test('renders each paragraph of an array description', () => {
    const { container } = render(<InfoCard title="Hero" tag="T" text={['One.', 'Two.']} />);
    expect([...container.querySelectorAll('p')].map((p) => p.textContent)).toEqual(['One.', 'Two.']);
});

test('omits the tag when none is given', () => {
    const { container } = render(<InfoCard title="Hero" text="Drives." />);
    expect(container.querySelector('.infoCardTag')).toBeNull();
    expect([...container.firstChild.children].map((el) => el.tagName)).toEqual(['H3', 'P']);
});

test('renders a badge between the heading and the tag when given', () => {
    const { container } = render(<InfoCard title="Engineer" badge="Work in Progress" tag="T" text="x" />);
    const card = container.firstChild;
    expect([...card.children].map((el) => el.className || el.tagName)).toEqual([
        'H3',
        'infoCardBadge',
        'infoCardTag',
        'P',
    ]);
    expect(card.children[0]).toHaveTextContent(/^Engineer$/);
    expect(card.children[1]).toHaveTextContent('Work in Progress');
});

test('omits the badge when none is given', () => {
    const { container } = render(<InfoCard title="Hero" tag="T" text="x" />);
    expect(container.querySelector('.infoCardBadge')).toBeNull();
});

test('adds a layout class alongside infoCard', () => {
    const { container } = render(<InfoCard className="robotDesc" title="Hero" text="x" />);
    expect(container.firstChild.className).toBe('infoCard robotDesc');
});

test('root class is exactly infoCard with no className', () => {
    const { container } = render(<InfoCard title="Hero" text="x" />);
    expect(container.firstChild.className).toBe('infoCard');
});
