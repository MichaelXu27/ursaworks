import fs from 'node:fs';
import path from 'node:path';

// jsdom cannot exercise compositing, so this guards the one numeric invariant
// that caused .bgAnimation to rasterise over the page content: the rotated grid
// plane must stay in FRONT of the perspective camera.
//
// The plane is rotateX'd about its own centre, so its furthest point sits
// --grid-depth away, at z = --grid-depth * sin(82deg). Once that reaches the
// perspective distance the projection goes degenerate and Chrome paints the
// layer over everything (z-index is powerless -- the 3D transform gives it its
// own render surface). Regression: the contact page vanished on any viewport
// tall enough that .container stopped scrolling.
const css = fs.readFileSync(
    path.join(__dirname, '..', 'styles', 'bgAnimationStyle.css'),
    'utf8'
);

const readPx = (prop) => {
    const match = css.match(new RegExp(`${prop}:\\s*(-?[\\d.]+)px`));
    expect(match, `expected a px value for ${prop} in bgAnimationStyle.css`).not.toBeNull();
    return Number(match[1]);
};

const readAngle = () => {
    const match = css.match(/rotateX\((-?[\d.]+)deg\)/);
    expect(match, 'expected a rotateX(...) on .bgAnimation').not.toBeNull();
    return Number(match[1]);
};

const readPerspective = () => {
    const match = css.match(/perspective\(([\d.]+)px\)/);
    expect(match, 'expected a perspective(...) on .bgAnimation').not.toBeNull();
    return Number(match[1]);
};

test('the grid plane stays in front of the perspective camera', () => {
    const depth = readPx('--grid-depth');
    const perspective = readPerspective();
    const z = depth * Math.sin((readAngle() * Math.PI) / 180);

    expect(z).toBeLessThan(perspective);
});

test('.bgAnimation is sized from --grid-depth, not the viewport', () => {
    // A vh-based height scales past the camera on tall viewports, which is the
    // exact shape of the original bug.
    const rule = css.slice(css.indexOf('.bgAnimation {'), css.indexOf('.bgAnimationGrid'));

    expect(rule).toMatch(/height:\s*calc\(var\(--grid-depth\)/);
    expect(rule).toMatch(/top:\s*calc\(var\(--grid-depth\)/);
    expect(rule).not.toMatch(/(height|top):\s*-?[\d.]+vh/);
});
