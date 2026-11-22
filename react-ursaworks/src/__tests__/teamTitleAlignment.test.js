import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// About / Events / Robots keep padding-top: 10rem at every width, so their
// titles sit at the same height under the fixed navbar. "Our Team" must too,
// including inside its phone media query.
const __dirname = dirname(fileURLToPath(import.meta.url));
const css = fs.readFileSync(resolve(__dirname, '../styles/teamStyle.css'), 'utf8');

const topPadding = (block) => {
    const top = block.match(/padding-top:\s*([^;]+);/);
    if (top) return top[1].trim();
    const shorthand = block.match(/padding:\s*([^;]+);/);
    return shorthand ? shorthand[1].trim().split(/\s+/)[0] : null;
};

test('Our Team keeps 10rem navbar clearance on phones', () => {
    const phone = css.slice(css.indexOf('@media (max-width: 758px)'));
    const teamBlock = phone.match(/#teamBlock\s*\{([^}]*)\}/);
    expect(teamBlock).not.toBeNull();
    expect(topPadding(teamBlock[1])).toBe('10rem');
});
