import { render, screen } from '@testing-library/react';
import Contact from '../Contact';
import content from '../../content.json';

test('renders the club contact links only', () => {
    render(<Contact />);

    expect(screen.getByRole('heading', { name: 'Get in Touch' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: new RegExp(content.contact.email) }))
        .toHaveAttribute('href', `mailto:${content.contact.email}`);
    expect(screen.getByRole('link', { name: new RegExp(content.contact.instagramHandle) }))
        .toHaveAttribute('href', content.contact.instagramUrl);

    expect(screen.queryByText('ARC Robotics Competition')).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Leadership' })).toBeNull();
});
