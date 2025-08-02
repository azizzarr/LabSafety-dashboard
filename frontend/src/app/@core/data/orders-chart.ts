import {Observable} from "rxjs";

export interface OrdersChart {
  chartLabel: string[];
  linesData: number[][];
   dataStream: Observable<OrdersChart>;
}

export abstract class OrdersChartData {
  abstract getOrdersChartData(period: string): OrdersChart;
}
