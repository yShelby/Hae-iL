import axios from 'axios';

const BASE_URL = '/api/charts';

/**
 * @param {{
 *   userId: number,
 *   mode: "weekly" | "monthly",
 *   weeklyDates: string[],       // e.g. ["2025-07-01", ...]
 *   monthlyDates: string[],      // e.g. ["2025-07-01", ...]
 *   twoMonths: string[]          // e.g. ["2025-06", "2025-07"]
 * }} chartDates
 */
export async function fetchChartData(chartDates){
    return axios.post(BASE_URL, chartDates);
}