import { Injectable } from '@angular/core';
import {of as observableOf, Observable, interval, throwError} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import { LiveUpdateChart, PieChart, EarningData } from '../data/earning';
import {WorkersService} from '../../services/workers.service';

@Injectable()
export class EarningService extends EarningData {
  constructor(private workersService: WorkersService) {
    super();
  }
  private currentDate: Date = new Date();
  private currentValue = Math.random() * 1000;
  private ONE_DAY = 24 * 3600 * 1000;

  private pieChartData = [
    {
      value: 50,
      name: 'poste 1',
    },
    {
      value: 25,
      name: 'poste 2 ',
    },
    {
      value: 25,
      name: 'poste 3',
    },
  ];

  private liveUpdateChartData = {
    bitcoin: {
      liveChart: [],
      delta: {
        up: true,
        value: 4,
      },
      dailyIncome: 895,
    },
    tether: {
      liveChart: [],
      delta: {
        up: false,
        value: 9,
      },
      dailyIncome: 862,
    },
    ethereum: {
      liveChart: [],
      delta: {
        up: false,
        value: 21,
      },
      dailyIncome: 584,
    },
  };

  getDefaultLiveChartData(elementsNumber: number) {
    this.currentDate = new Date();
    this.currentValue = Math.random() * 1000;

    return Array.from(Array(elementsNumber))
      .map(item => this.generateRandomLiveChartData());
  }
/*
 generateRandomLiveChartData() {
    this.currentDate = new Date(+this.currentDate + this.ONE_DAY);
    this.currentValue = this.currentValue + Math.random() * 20 - 11;

    if (this.currentValue < 0) {
      this.currentValue = Math.random() * 100;
    }

    return {
      value: [
        [
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          this.currentDate.getDate(),
        ].join('/'),
        Math.round(this.currentValue),
      ],
    };
  }
*/
  generateRandomLiveChartData() {
    this.currentDate = new Date(+this.currentDate + this.ONE_DAY);
    this.currentValue = this.currentValue + Math.random() * 20 - 11;

    if (this.currentValue < 0) {
      this.currentValue = Math.random() * 100;
    }

    return {
      value: [
        [
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          this.currentDate.getDate(),
        ].join('/'),
        Math.round(this.currentValue),
      ],
    };
  }

  getEarningLiveUpdateCardData(): Observable<{ value: [string, number] }[]> {
    return this.workersService.getAllWorkers().pipe(
      map(workers => {
        return workers.map(worker => {
          const formattedDate = new Date(worker.date).toLocaleDateString('en', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).replace(/\//g, '/');
          return { value: [formattedDate, worker.chargeEsd] };
        });
      })
    );
  }











/*
  getEarningCardData(currency: string): Observable<LiveUpdateChart> {
    const data = this.liveUpdateChartData[currency.toLowerCase()];

    if (!data) {
      // Handle the case where data for the specified currency is not found
      // For example, you can return a default value or throw an error
      return throwError(`Data for currency ${currency} not found`);
    }

    data.liveChart = this.getDefaultLiveChartData(13);

    return observableOf(data);
  }
*/
  getEarningCardData(): Observable<{ value: [string, number] }[]> {
    return this.workersService.getAllWorkers().pipe(
      map(workers => {
        return workers.map(worker => {
          const formattedDate = new Date(worker.date).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).replace(/\//g, '/');
          return { value: [formattedDate, worker.chargeEsd] };
        });
      })
    );
  }
  getEarningPieChartData(): Observable<PieChart[]> {
    return observableOf(this.pieChartData);
  }
}
