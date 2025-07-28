
// 백엔드 객체 배열을 리스트로 변환하는 함수

// 감정 점수: [{assessmentDate, score}] → [score1, score2, ...]
export function extractMoodScores(moodData) {
    return moodData.map(item => item.score);
}

// 운동 시간: [{exerciseDate, duration}] → [duration1, duration2, ...]
export function extractExerciseDuration(exerciseData) {
    return exerciseData.map(item => item.duration);
}

// 수면 시간: [{sleepDate, bedtime분, waketime분}] → [[bedtime분, waketime분], ...]
export function extractSleepTime(sleepData) {
    return sleepData.map(item => [item.bedtime, item.waketime]);
}

// 자가진단: {anxiety, depression, stress} → [anxiety, depression, stress]
export function extractDiagnosisResults(diagnosisData) {
    return [diagnosisData.anxiety, diagnosisData.depression, diagnosisData.stress];
}