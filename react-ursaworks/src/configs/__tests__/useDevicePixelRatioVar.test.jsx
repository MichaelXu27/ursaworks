import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useDevicePixelRatioVar from '../useDevicePixelRatioVar';

function mockMatchMedia() {
    const listeners = [];
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
        matches: true,
        media: query,
        addEventListener: (_type, fn) => listeners.push({ query, fn }),
        removeEventListener: (_type, fn) => {
            const i = listeners.findIndex((l) => l.fn === fn && l.query === query);
            if (i !== -1) listeners.splice(i, 1);
        },
    }));
    return listeners;
}

function setDpr(value) {
    Object.defineProperty(window, 'devicePixelRatio', { value, configurable: true });
}

describe('useDevicePixelRatioVar', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        setDpr(1);
    });

    it('sets --dpr on <html> to the current device pixel ratio', () => {
        mockMatchMedia();
        setDpr(0.9);
        renderHook(() => useDevicePixelRatioVar());
        expect(document.documentElement.style.getPropertyValue('--dpr')).toBe('0.9');
    });

    it('updates --dpr when the ratio changes (browser zoom) and tracks the new value', () => {
        const listeners = mockMatchMedia();
        setDpr(1);
        renderHook(() => useDevicePixelRatioVar());
        expect(listeners).toHaveLength(1);
        expect(listeners[0].query).toBe('(resolution: 1dppx)');

        setDpr(0.25);
        listeners[0].fn();

        expect(document.documentElement.style.getPropertyValue('--dpr')).toBe('0.25');
        expect(listeners).toHaveLength(1);
        expect(listeners[0].query).toBe('(resolution: 0.25dppx)');
    });

    it('removes the listener and --dpr on unmount', () => {
        const listeners = mockMatchMedia();
        const { unmount } = renderHook(() => useDevicePixelRatioVar());
        unmount();
        expect(listeners).toHaveLength(0);
        expect(document.documentElement.style.getPropertyValue('--dpr')).toBe('');
    });
});
