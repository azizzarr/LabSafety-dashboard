/*import { Component, OnDestroy, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { OrdersChartComponent } from './charts/orders-chart.component';
import { ProfitChartComponent } from './charts/profit-chart.component';
import { OrdersChart } from '../../../@core/data/orders-chart';
import { ProfitChart } from '../../../@core/data/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from '../../../@core/data/orders-profit-chart';

@Component({
  selector: 'ngx-ecommerce-charts',
  styleUrls: ['./charts-panel.component.scss'],
  templateUrl: './charts-panel.component.html',
})
export class ECommerceChartsPanelComponent implements OnDestroy {

  private alive = true;

  chartPanelSummary: OrderProfitChartSummary[];
  period: string = 'week';
  ordersChartData: OrdersChart;
  profitChartData: ProfitChart;

  @ViewChild('ordersChart', { static: true }) ordersChart: OrdersChartComponent;
  @ViewChild('profitChart', { static: true }) profitChart: ProfitChartComponent;

  constructor(private ordersProfitChartService: OrdersProfitChartData) {
    this.ordersProfitChartService.getOrderProfitChartSummary()
      .pipe(takeWhile(() => this.alive))
      .subscribe((summary) => {
        this.chartPanelSummary = summary;
      });

    this.getOrdersChartData(this.period);
    this.getProfitChartData(this.period);
  }

  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getOrdersChartData(value);
    this.getProfitChartData(value);
  }

  changeTab(selectedTab) {
    if (selectedTab.tabTitle === 'Profit') {
      this.profitChart.resizeChart();
    } else {
      this.ordersChart.resizeChart();
    }
  }

  getOrdersChartData(period: string) {
    this.ordersProfitChartService.getOrdersChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        this.ordersChartData = ordersChartData;
      });
  }

  getProfitChartData(period: string) {
    this.ordersProfitChartService.getProfitChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(profitChartData => {
        this.profitChartData = profitChartData;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
*/

import { Component, OnDestroy, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { OrdersChartComponent } from './charts/orders-chart.component';
import { WorkersService} from '../../../services/workers.service';
import { OrdersChartService } from '../../../@core/mock/orders-chart.service';
import { Worker } from '../../../models/worker.model';
import {OrdersChart} from '../../../@core/data/orders-chart';
import {ProfitChart} from '../../../@core/data/profit-chart';
import {OrderProfitChartSummary, OrdersProfitChartData} from '../../../@core/data/orders-profit-chart';
import {forkJoin, of} from 'rxjs';
@Component({
  selector: 'ngx-ecommerce-charts',
  styleUrls: ['./charts-panel.component.scss'],
  templateUrl: './charts-panel.component.html',
})
export class ECommerceChartsPanelComponent implements OnDestroy {

  private alive = true;

  chartPanelSummary: OrderProfitChartSummary[];
  period: string = 'week';
  // ordersChartData: OrdersChart;
  profitChartData: ProfitChart;
  ordersChartData: OrdersChart;

  @ViewChild('ordersChart', { static: true }) ordersChart: OrdersChartComponent;
  private profitChart: any;

  constructor(
    private workersService: WorkersService,
    private ordersChartService: OrdersChartService,
    private ordersProfitChartService: OrdersProfitChartData,
  ) {
    this.fetchWorkerData();
  }

  fetchWorkerData() {
    forkJoin([
      this.workersService.getAllWorkers(),
      this.workersService.getWorkersByPosteCMS1(),
    ]).pipe(takeWhile(() => this.alive))
      .subscribe(([allWorkers, cms1Workers]: [Worker[], Worker[]]) => {
        const chargeEsdByDate = {};

        // Process all workers including CMS1 workers
        allWorkers.concat(cms1Workers).forEach(worker => {
          if (!this.isValidDate(worker.date)) {
          //  console.log('Worker with missing or invalid date:', worker);
            return;
          }

          const dateString = new Date(worker.date[0], worker.date[1] - 1, worker.date[2]).toLocaleDateString();

          if (!chargeEsdByDate[dateString]) {
            chargeEsdByDate[dateString] = [];
          }
          chargeEsdByDate[dateString].push(worker.chargeEsd);
        });

        const chartLabel = [];
        const linesData = [];

        // Sort dates and populate chartLabel and linesData simultaneously
        Object.keys(chargeEsdByDate)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .forEach(dateString => {
            chartLabel.push(dateString);
            linesData.push(chargeEsdByDate[dateString]);
          });

        // Assign the updated data to ordersChartData
        const ordersChart: OrdersChart = {
          chartLabel,
          linesData,
          dataStream: of(null),
        };

      //  console.log('Orders Chart Data:', ordersChart);
        this.ordersChartData = ordersChart;

      //  console.log('Assigned orders chart data:', this.ordersChartData);
        this.getOrdersChartData('period');
      });
  }








  /*
   fetchWorkerData() {
      // Static worker data for demonstration
      const staticWorkers: Worker[] = [
        {
          workerId: 1,
          matricule: 'M123',
          nom: 'John',
          prenom: 'Doe',
          email: 'john@example.com',
          date: new Date(2024, 3, 1),
          phone: '123456789',
          chargeEsd: 100,
          postes: []
        },
        {
          workerId: 2,
          matricule: 'M456',
          nom: 'Jane',
          prenom: 'Doe',
          email: 'jane@example.com',
          date: new Date(2024, 3, 2),
          phone: '987654321',
          chargeEsd: 123,
          postes: []
        },
        {
          workerId: 3,
          matricule: 'M789',
          nom: 'Alice',
          prenom: 'Smith',
          email: 'alice@example.com',
          date: new Date(2024, 3, 3),
          phone: '111222333',
          chargeEsd: 130,
          postes: []
        },
        // Add more static worker data as needed
      ];

      // Assuming workers contain the necessary data for chartLabel and linesData
      const ordersChart: OrdersChart = {
        chartLabel: [],
        linesData: [],
      };

      staticWorkers.forEach(worker => {
        // Convert date to a string representation
        const dateString = worker.date.toLocaleDateString();
        ordersChart.chartLabel.push(dateString);

        // Add worker's chargeEsd to the corresponding position in linesData
        if (!ordersChart.linesData[0]) {
          ordersChart.linesData[0] = [];
        }
        ordersChart.linesData[0].push(worker.chargeEsd);
      });

      console.log('Orders Chart Data:', ordersChart); // Log the orders chart data

      // Emit orders chart data to the component
      this.ordersChartData = ordersChart;

      console.log('Assigned orders chart data:', this.ordersChartData); // Log assigned data

      // After assigning data, update the chart with the new data
      this.getOrdersChartData('period'); // Pass a single string representing the period
    }

  */



  isValidDate(date: any): boolean {
    // Check if the date is an array with three elements and all are numbers
    return Array.isArray(date) && date.length === 3 &&
      date.every(elem => typeof elem === 'number');
  }









  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }

    this.getOrdersChartData(value);
    this.getProfitChartData(value);
  }

  changeTab(selectedTab) {
    if (selectedTab.tabTitle === 'Profit') {
      this.profitChart.resizeChart();
    } else {
      this.ordersChart.resizeChart();
    }
  }
  ngOnDestroy() {
    this.alive = false;
  }
  getProfitChartData(period: string) {
    this.ordersProfitChartService.getProfitChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(profitChartData => {
        this.profitChartData = profitChartData;
      });
  }
  getOrdersChartData(period: string) {
    this.ordersChartService.getOrdersChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        this.ordersChartData = ordersChartData;
      });

  }
}

