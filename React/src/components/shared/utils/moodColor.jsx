const moodColorPalette = [
    { score: -125, color: "#393E75" },
    { score: -100, color: "#644C80" },
    { score: -75,  color: "#8E588A" },
    { score: -50,  color: "#B5698F" },
    { score: -25,  color: "#D07A91" },
    { score: 0,    color: "#DC8991" },
    { score: 25,   color: "#ED8991" },
    { score: 50,   color: "#FE978E" },
    { score: 75,   color: "#FEA88D" },
    { score: 100,  color: "#FEBB8E" },
    { score: 125,  color: "#FFE5AE" },
    { score: 150,  color: "#FFF7CA" },
];

export function getClosestPaletteScore(score) {
    let closest = moodColorPalette[0].score;
    let minDiff = Math.abs(score - closest);
    for (const p of moodColorPalette) {
        const diff = Math.abs(score - p.score);
        if (diff < minDiff) {
            closest = p.score;
            minDiff = diff;
        }
    }
    return closest;
}

export function getMoodColor(score) {
    const p = moodColorPalette.find(p => p.score === score);
    return p ? p.color : "#DC8991"; // default color
}

export function getMoodBackgroundColor(score) {
    const back = getClosestPaletteScore(score +50);
    return getMoodColor(back);

}

export function getMoodWaveColors(score) {
    const main = getClosestPaletteScore(score);
    const left = getClosestPaletteScore(main - 25);
    const right = getClosestPaletteScore(main + 25);

    return [
        { score: left,  color: getMoodColor(left) },   // 하단 layer
        { score: main,  color: getMoodColor(main) },   // 중간 layer
        { score: right, color: getMoodColor(right) },  // 상단 layer
    ];
}