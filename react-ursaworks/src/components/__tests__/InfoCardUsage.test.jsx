import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import About from '../About';
import Event from '../Event';
import Robots from '../Robots';
import RobotsTeaser from '../home/RobotsTeaser';
import content from '../../content.json';

// Every label card renders through InfoCard, so each one gets the shared
// heading -> label -> description format. A page that went back to
// hand-built card markup would drop out of this count.
const PAGES = [
    ['robots page', Robots, content.robots.length, 'robotDesc'],
    ['home robot teaser', RobotsTeaser, content.robots.length, 'teaserRobotText'],
    ['about highlights', About, content.aboutHighlights.length, 'highlightCard'],
    ['events competitions', Event, content.competitions.length, 'competitionCard'],
];

test.each(PAGES)('%s renders its cards through InfoCard', (_name, Page, count, layoutClass) => {
    const { container } = render(<Page />, { wrapper: MemoryRouter });
    const cards = container.querySelectorAll(`.infoCard.${layoutClass}`);
    expect(cards).toHaveLength(count);
    for (const card of cards) {
        expect(card.firstElementChild.tagName).toBe('H3');
    }
});
