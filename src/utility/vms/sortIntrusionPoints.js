export function sortPoints(points) {
    points = points.splice(0);
    const p0 = {};
    p0.y = Math.min.apply(null, points.map(p => p.y));
    p0.x = Math.max.apply(null, points.filter(p => p.y === p0.y).map(p => p.x));
    points.sort((a, b) => angleCompare(p0, a, b));
    return points;
}

function angleCompare(p0, a, b) {
    const left = isLeft(p0, a, b);
    if (left === 0) return distCompare(p0, a, b);
    return left;
}

function isLeft(p0, a, b) {
    return (a.x - p0.x) * (b.y - p0.y) - (b.x - p0.x) * (a.y - p0.y);
}

function distCompare(p0, a, b) {
    const distA = (p0.x - a.x) * (p0.x - a.x) + (p0.y - a.y) * (p0.y - a.y);
    const distB = (p0.x - b.x) * (p0.x - b.x) + (p0.y - b.y) * (p0.y - b.y);
    return distA - distB;
}