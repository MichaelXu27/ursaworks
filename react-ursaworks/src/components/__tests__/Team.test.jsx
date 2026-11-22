import { render, screen } from '@testing-library/react';
import Team from '../Team';
import content from '../../content.json';

test('renders the title, leadership and every non-empty subteam in order', () => {
    render(<Team />);

    expect(screen.getByRole('heading', { level: 2, name: 'Our Team' })).toBeInTheDocument();

    const groups = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(groups).toEqual(['Leadership', 'Mechanical', 'Electrical', 'Software', 'Business']);
    expect(screen.getByText('Algorithm & Control')).toBeInTheDocument();

    content.team.leadership.forEach(({ name, email }) => {
        expect(screen.getByRole('heading', { level: 4, name })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: `Email ${name}` }))
            .toHaveAttribute('href', `mailto:${email}`);
    });

    const total = content.team.leadership.length
        + content.team.subteams.reduce((count, subteam) => count + subteam.members.length, 0);
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(total);
});

test('skips a subteam with no members', () => {
    content.team.subteams.push({ name: 'Ghost Team', members: [] });
    try {
        render(<Team />);
        expect(screen.queryByRole('heading', { name: 'Ghost Team' })).toBeNull();
    } finally {
        content.team.subteams.pop();
    }
});

test('skips a subteam with no members list instead of crashing', () => {
    content.team.subteams.push({ name: 'Stub Team' });
    try {
        render(<Team />);
        expect(screen.getByRole('heading', { level: 2, name: 'Our Team' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Stub Team' })).toBeNull();
    } finally {
        content.team.subteams.pop();
    }
});
