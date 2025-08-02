import { AfterViewInit, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { Worker } from '../../../../models/worker.model';
import { WorkersService } from '../../../../services/workers.service';

@Component({
  selector: 'ngx-echarts-bar-animation',
  template: `
    <div echarts [options]="options" class="echarts"></div>
  `,
})
export class ComparitionBarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() title: string;
  @Input() matricule: string;
  options: any = {};
  themeSubscription: any;
  xAxisData: string[] = [];
  data1: number[] = [];
  data2: number[] = [];

  constructor(private theme: NbThemeService, private workersService: WorkersService) {}

  ngOnInit() {
    console.log('ComparitionBarComponent initialized.');
    if (this.matricule) {
      console.log('Matricule received:', this.matricule);
      this.fetchWorkersData(this.matricule);
    } else {
      console.error('Matricule is not provided!');
    }
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.primaryLight, colors.infoLight],
        legend: {
          data: ['bar', 'bar2'],
          align: 'left',
          textStyle: {
            color: echarts.textColor,
          },
        },
        xAxis: [
          {
            data: this.xAxisData,
            silent: false,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            const dataIndex = params[0].dataIndex;
            const chargeEsd = this.data1[dataIndex];
            const date = this.xAxisData[dataIndex];
            return `Date: ${date}<br/>Charge ESD: ${chargeEsd}`;
          },
        },
        series: [
          {
            name: 'bar',
            type: 'bar',
            data: this.data1,
            animationDelay: idx => idx * 10,
          },
          {
            name: 'bar2',
            type: 'bar',
            data: this.data2,
            animationDelay: idx => idx * 10 + 100,
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: idx => idx * 5,
      };
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  fetchWorkersData(matricule: string): void {
    console.log('fetchWorkersData called with matricule:', matricule);
    this.workersService.getWorkersByMatricule(matricule).subscribe((workers: Worker[]) => {
      // Sort workers based on date
      const sortedWorkers = workers.slice().sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });

      // Clear previous data
      this.xAxisData = [];
      this.data1 = [];
      this.data2 = [];

      sortedWorkers.forEach(worker => {
        console.log('Date before formatting:', worker.date);
        // Convert date array to Date object and then format it
        const workerDateArray = worker.date as unknown as number[];
        const workerDate = new Date(workerDateArray[0], workerDateArray[1] - 1, workerDateArray[2], workerDateArray[3], workerDateArray[4], workerDateArray[5]);
        const formattedDate = this.formatDate(workerDate);
        console.log('Date after formatting:', formattedDate);
        this.xAxisData.push(formattedDate); // Add formatted date to xAxisData
        this.data1.push(worker.chargeEsd); // Add chargeEsd to data1
        this.data2.push((Math.cos(this.xAxisData.length / 5) * (this.xAxisData.length / 5 - 10) + this.xAxisData.length / 6) * 5); // Generate static data for data2
      });

      // Update chart options after data is fetched and sorted
      this.updateChartOptions();
    });
  }

  updateChartOptions(): void {
    this.options = {
      ...this.options,
      xAxis: {
        ...this.options.xAxis,
        data: this.xAxisData,
      },
      series: [
        {
          ...this.options.series[0],
          data: this.data1,
        },
        {
          ...this.options.series[1],
          data: this.data2,
        },
      ],
    };
  }

  formatDate(date: Date): string {
    return date.toLocaleString('en-GB', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).replace(',', '');
  }
}
