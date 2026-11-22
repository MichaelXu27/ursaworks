import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import content from '../content.json';

// RoboMaster North America rebranded to ARC. The single intentional survivor is
// the historical note in the ARC section; anything else naming the old brand is
// a miss. Historical event names like "RMNA 2025" are correct and unaffected —
// those events really did happen under that name.
const ALLOWED_MENTIONS = ['formerly RoboMaster North America'];

test('content.json carries no leftover RoboMaster branding', () => {
    let text = JSON.stringify(content);
    for (const allowed of ALLOWED_MENTIONS) {
        text = text.split(allowed).join('');
    }
    expect(text).not.toMatch(/robomaster/i);
});

// content.json is not the only place the brand name appears. The page title and
// the site chrome are hand-written outside it, and both were missed on the first
// pass of this rebrand — a scan there is the cheapest guard against a repeat.
const __dirname = dirname(fileURLToPath(import.meta.url));
const chromeSources = ['../../index.html', '../components/Footer.jsx', '../components/Navbar.jsx'];

test.each(chromeSources)('%s carries no leftover RoboMaster branding', (relativePath) => {
    const source = fs.readFileSync(resolve(__dirname, relativePath), 'utf8');
    expect(source).not.toMatch(/robomaster/i);
});

test('robots are ordered Infantry, Sentry, Hero, Engineer', () => {
    expect(content.robots.map((robot) => robot.name)).toEqual(['Infantry', 'Sentry', 'Hero', 'Engineer']);
});

test('competition tags carry no location', () => {
    // Locations belong on event entries, which record where each year was held.
    // On the competition cards they go stale — the championship venue moves.
    for (const competition of content.competitions) {
        expect(competition.tag).not.toMatch(/,/);
    }
});
