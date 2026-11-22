import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactPage from '../ContactPage';

test('shows the roster before the contact section', () => {
    render(<ContactPage />, { wrapper: MemoryRouter });

    const team = screen.getByRole('heading', { level: 2, name: 'Our Team' });
    const contact = screen.getByRole('heading', { level: 2, name: 'Get in Touch' });
    expect(team.compareDocumentPosition(contact) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
