import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import content from '../content.json';

// Parse the extension list out of the real glob so this test cannot drift from
// it. An image whose extension is missing there resolves to null and renders as
// a broken image, with only a console.error to show for it.
const __dirname = dirname(fileURLToPath(import.meta.url));
const loaderSource = fs.readFileSync(
    resolve(__dirname, '../configs/loadImages.js'),
    'utf8'
);
const supported = loaderSource.match(/\*\.\{([^}]+)\}/)[1].split(',');

// Team members are grouped (leadership + subteams); image is optional and
// falls back to a placeholder, so only members that name one are checked.
const teamMembers = [
    ...content.team.leadership,
    ...content.team.subteams.flatMap((subteam) => subteam.members),
].filter((member) => member.image);

const referencedImages = [
    content.aboutImage,
    ...content.robots.map((robot) => robot.image),
    ...content.events.map((event) => event.image),
    ...teamMembers.map((member) => member.image),
];

test.each(referencedImages)('%s has an extension loadImages can resolve', (filename) => {
    expect(supported).toContain(filename.split('.').pop().toLowerCase());
});

// Existence check: filenames referenced in content.json must actually be present
// under src/assets/<folder>/, mirroring the folder each component passes to
// loadImage(folder, name). A typo here would otherwise pass the extension check
// above while rendering a broken image at runtime.
const referencedImagesByFolder = [
    { folder: 'about', filename: content.aboutImage },
    ...content.robots.map((robot) => ({ folder: 'robots', filename: robot.image })),
    ...content.events.map((event) => ({ folder: 'events', filename: event.image })),
    // MemberCard reads these from 'members', not 'team' — the folder name and the
    // content key differ, which is exactly the kind of mismatch this catches.
    ...teamMembers.map((member) => ({ folder: 'members', filename: member.image })),
];

test.each(referencedImagesByFolder)(
    '$filename exists in src/assets/$folder',
    ({ folder, filename }) => {
        const imagePath = resolve(__dirname, '../assets', folder, filename);
        expect(
            fs.existsSync(imagePath),
            `Expected image file "${filename}" to exist at ${imagePath}`
        ).toBe(true);
    }
);
