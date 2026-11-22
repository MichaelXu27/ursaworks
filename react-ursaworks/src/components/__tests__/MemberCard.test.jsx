import { render, screen, fireEvent } from '@testing-library/react';
import MemberCard from '../MemberCard';

// The only real file in assets/members is the placeholder, so stand in a
// distinct photo URL to tell "loaded the photo" apart from "fell back".
vi.mock('../../configs/loadImages', () => ({ default: () => '/photos/ada.jpg' }));

test('renders name, role and only the links provided', () => {
    render(
        <MemberCard
            name="Ada Lovelace"
            role="Software Lead"
            email="ada@wustl.edu"
            linkedin="https://linkedin.com/in/ada"
        />
    );

    expect(screen.getByRole('heading', { level: 4, name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByText('Software Lead')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Email Ada Lovelace' }))
        .toHaveAttribute('href', 'mailto:ada@wustl.edu');

    const linkedin = screen.getByRole('link', { name: 'Ada Lovelace on LinkedIn' });
    expect(linkedin).toHaveAttribute('href', 'https://linkedin.com/in/ada');
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');

    expect(screen.queryByRole('link', { name: 'Ada Lovelace on GitHub' })).toBeNull();
});

test('renders no links when none are provided', () => {
    render(<MemberCard name="First Last" role="Member" />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
});

test('uses the placeholder without logging when no image is given', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<MemberCard name="First Last" role="Member" />);
    expect(screen.getByRole('img', { name: 'First Last' }).getAttribute('src'))
        .toContain('memberPlaceholder');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
});

test('falls back to the placeholder once when the image fails', () => {
    render(<MemberCard name="First Last" role="Member" image="ada.jpg" />);
    const img = screen.getByRole('img', { name: 'First Last' });
    expect(img.getAttribute('src')).toBe('/photos/ada.jpg');
    fireEvent.error(img);
    expect(img.getAttribute('src')).toContain('memberPlaceholder');
    // A second failure must not re-trigger the swap or throw.
    expect(() => fireEvent.error(img)).not.toThrow();
});
