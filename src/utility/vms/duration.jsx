
export function format(seconds) {
    if (!seconds || 0 || isNaN(seconds)) {
        return "00:00:00";
    }
    const date = new Date(seconds * 1000);
    const hh = pad(date.getUTCHours());
    const mm = pad(date.getUTCMinutes());
    const ss = pad(date.getUTCSeconds());
    if (hh) {
        return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
}

function pad(string) {
    return ('0' + string).slice(-2);
}

export function formatWithMilliseconds(milliseconds) {
    if (!milliseconds || 0 || isNaN(milliseconds)) {
        return "00:00:00";
    }
    const date = new Date(milliseconds);
    const hh = pad(date.getUTCHours());
    const mm = pad(date.getUTCMinutes());
    const ss = pad(date.getUTCSeconds());
    if (hh) {
        return `${hh}:${pad(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
}
