import { Observable } from 'rxjs';

export interface LiveUpdateChart {
  liveChart: { value: [string, number] }[];
  delta: {
    up: boolean;
    value: number;
  };
  dailyIncome: number;
}

export interface PieChart {
  value: number;
  name: string;
}

export abstract class EarningData {
 // abstract getEarningLiveUpdateCardData(): Observable<LiveUpdateChart[]>;
  abstract getEarningLiveUpdateCardData(): Observable<{ value: [string, number] }[]>;
  abstract getEarningCardData(): Observable<{ value: [string, number] }[]>;
// abstract getEarningCardData(currency: string): Observable<LiveUpdateChart>;
  abstract getEarningPieChartData(): Observable<PieChart[]>;
}
