import * as React from 'react';

export interface Error {
    state: boolean;
    retry: () => void;
}

export function useData<T>(getData: () => Promise<T>, init?: T, callback?: (data: T) => void, dependencies: unknown[] = []): [T, boolean, Error] {
    const [data, setData] = React.useState(init as T);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [retrying, retry] = React.useState(false);
    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            const intData = await getData();
            setLoading(false);
            setData(intData);
            if (callback) {
                callback(intData);
            }
        } catch (e) {
            setError(e);
        }
    }, [getData, callback]);

    React.useEffect(() => {
        fetchData();
    }, [...dependencies, retrying]);
    return [data as T, loading, {state: error, retry: () => retry(!retrying)} as Error];
}

export const appendSuffixToClasses = (classNames: string, suffix: string): string => {
    const clString = classNames;
    const cl = (clString || '').split(' ') || [];
    const suffixed = [];
    for (const c of cl) {
        if (!c.endsWith(suffix) && c !== ' ' && c !== '') {
            suffixed.push(c + suffix);
        }
    }
    return suffixed.join(' ');
};

export const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (ref.current && !ref.current.contains(target)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [ref, callback]);
};

export const useWidth = (ref: React.RefObject<HTMLElement>): number => {
    const [width, setWidth] = React.useState(0);
    React.useEffect(() => {
        const updateWidth = () => setWidth(ref.current ? ref.current.offsetWidth : 0);
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, [ref]);
    return width;
};

export const useTimeout = (fx: () => void, timeoutMs: number, dependencies: React.DependencyList = []) => {
    const savedCallback = React.useRef(fx);

    React.useEffect(() => {
        savedCallback.current = fx;
    }, [fx]);

    React.useEffect(() => {
        const to = setTimeout(() => savedCallback.current(), timeoutMs);
        return () => clearTimeout(to);
    }, [timeoutMs, ...dependencies]);
};

export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(fxn: T, ms: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fxn(...args);
        }, ms);
    };
};

export function formatDuration(seconds: number, sigfigs = 1) {
    let remainingSeconds = Math.abs(Math.round(seconds));
    let formattedDuration = '';
    const figs = [];

    if (remainingSeconds > 86400) {
        const days = Math.floor(remainingSeconds / 86400) + 'd';
        figs.push(days);
        formattedDuration += days;
        remainingSeconds = remainingSeconds % 86400;
    }

    if (remainingSeconds > 3600) {
        const hours = Math.floor(remainingSeconds / 3600) + 'h';
        figs.push(hours);
        formattedDuration += hours;
        remainingSeconds = remainingSeconds % 3600;
    }

    if (remainingSeconds > 60) {
        const minutes = Math.floor(remainingSeconds / 60) + 'm';
        figs.push(minutes);
        formattedDuration += minutes;
        remainingSeconds = remainingSeconds % 60;
    }

    if (remainingSeconds > 0 || Math.round(seconds) === 0) {
        figs.push(remainingSeconds + 's');
        formattedDuration += remainingSeconds + 's';
    }

    if (sigfigs <= figs.length) {
        formattedDuration = '';
        for (let i = 0; i < sigfigs; i++) {
            formattedDuration += figs[i];
        }
        return formattedDuration;
    }

    return formattedDuration;
}

export const ago = (date: Date) => {
    const secondsAgo = (new Date().getTime() - date.getTime()) / 1000;
    const duration = formatDuration(secondsAgo);
    if (secondsAgo < 0) {
        return 'in ' + duration;
    } else {
        return duration + ' ago';
    }
};
