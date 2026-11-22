import { useEffect } from 'react';

// Mirrors window.devicePixelRatio into a `--dpr` custom property on <html> and
// keeps it current. Browser zoom (Ctrl +/-) changes the ratio, and CSS has no
// way to read it as a number, so styles that must stay a fixed size in *device*
// pixels (e.g. the background grid's hairlines) divide by var(--dpr) instead.
//
// A `(resolution: Xdppx)` query only matches the ratio it was built for, so
// each change re-registers a listener for the new value.
export default function useDevicePixelRatioVar() {
    useEffect(() => {
        const root = document.documentElement;
        let mql;

        const update = () => {
            const dpr = window.devicePixelRatio || 1;
            root.style.setProperty('--dpr', String(dpr));

            mql?.removeEventListener('change', update);
            mql = window.matchMedia(`(resolution: ${dpr}dppx)`);
            mql.addEventListener('change', update);
        };

        update();
        return () => {
            mql?.removeEventListener('change', update);
            root.style.removeProperty('--dpr');
        };
    }, []);
}
