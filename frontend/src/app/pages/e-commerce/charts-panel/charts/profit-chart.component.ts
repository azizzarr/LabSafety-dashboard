import { Component, AfterViewInit, Input, SimpleChanges, OnChanges, Renderer2 } from '@angular/core';
import { NbDialogConfig, NbDialogRef, NbDialogService, NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../../@core/utils/layout.service';
import { OrdersChart } from '../../../../@core/data/orders-chart'; // Adjusted import path
import { Worker } from '../../../../models/worker.model';
import { OrdersChartService } from '../../../../@core/mock/orders-chart.service';
import { WorkersService } from '../../../../services/workers.service';
import { Observable } from 'rxjs';
import { ShowcaseDialogComponent } from '../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { DialogData } from '../../../../models/DialogData.model';
import * as moment from 'moment';
import { WorkerchartListComponent } from '../../../modal-overlays/dialog/Worker_Chart_List/workerchart-list.component';

@Component({
  selector: 'ngx-profit-chart',
  styleUrls: ['./charts-common.component.scss'],
  template: `
    <div class="mydict">
      <div>
        <label>
          <input type="radio" name="radio" (change)="handleFilterChange('All')" [checked]="selectedRadio === 'All'">
          <span>All</span>
        </label>
        <label *ngFor="let poste of postes">
          <input type="radio" name="radio" (change)="handleFilterChange(poste.name)" [checked]="selectedRadio === poste.name">
          <span>{{ poste.name }}</span>
        </label>
      </div>
    </div>

    <div echarts
         *ngIf="option"
         [options]="option"
         [merge]="option"
         class="echart"
         style="width: 700px; height: 450px;"
         (chartInit)="onChartInit($event)">
    </div>
  `,
})
export class ProfitChartComponent implements AfterViewInit, OnChanges {
  @Input()
  ordersChartData: OrdersChart;
  echartsInstance: any;
  option: any;
  chartDataAvailable = true;
  chartError = false;
  private ordersChart: any;
  selectedRadio: string = 'All'; // Default selected radio
  dialogOpened: boolean = false;
  postes: any[] = []; // Array to store postes

  constructor(private theme: NbThemeService,
              private layoutService: LayoutService,
              private ordersChartService: OrdersChartService,
              private workersService: WorkersService,
              private renderer: Renderer2,
              private dialogService: NbDialogService) {
    this.layoutService.onSafeChangeLayoutSize()
      .subscribe(() => this.resizeChart());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ordersChartData && changes.ordersChartData.currentValue) {
      this.updateOrdersChartOptions();
    }
  }

  ngAfterViewInit(): void {
    this.initializeChartOptions();
    this.fetchPostes();
    setTimeout(() => this.handleFilterChange('All'), 50); // Fetch postes on component initialization
  }

  handleFilterChange(value: string) {
    this.selectedRadio = value;
    this.setOptions(this.selectedRadio); // Update options based on selected radio
  }

  private initializeChartOptions(): void {
    this.theme.getJsTheme().subscribe(config => {
      const eTheme: any = config.variables.orders;
      this.setOptions(this.selectedRadio);
    });
  }

  private updateOrdersChartOptions(): void {
    if (!this.option || !this.ordersChartData || !this.ordersChartData.chartLabel) {
      return;
    }
    this.option.xAxis.data = this.ordersChartData.chartLabel;
  }

  private setOptions(selectedRadio: string): void {
    let observable: Observable<Worker[]>;

    if (selectedRadio === 'All') {
      observable = this.workersService.getWorkersByLast7Days();
    } else {
      observable = this.workersService.getWorkersByLast7DaysAndPoste(selectedRadio);
    }

    observable.subscribe((workers: Worker[]) => {
      workers.sort((a, b) => {
        const dateA = new Date(a.date[0], a.date[1] - 1, a.date[2]).getTime();
        const dateB = new Date(b.date[0], a.date[1] - 1, b.date[2]).getTime();
        return dateA - dateB;
      });

      const workersData = workers.map(worker => [
        moment(`${worker.date[0]}-${worker.date[1]}-${worker.date[2]}`).format('YYYY:MM:DD HH:mm:ss'),
        worker.chargeEsd,
      ]);

      const seriesData = {
        type: 'line',
        data: workersData,
        lineStyle: {
          color: selectedRadio === 'Integration' ? '#ee0a1f' : selectedRadio === 'CMS1' ?
            '#66ff33' : (selectedRadio === 'CMS2' ? '#b117d3' : '#0df4f5'),
          width: 5,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: selectedRadio === 'Integration' ? 'rgba(238, 10, 31, 0.8)' : selectedRadio === 'CMS1' ? 'rgba(102, 255, 51, 0.7)' : (selectedRadio === 'CMS2' ? 'rgba(177, 23, 211, 0.7)' : 'rgba(13, 244, 245, 0.7)'),
          }, {
            offset: 1,
            color: 'rgba(13, 244, 245, 0)',
          }]),
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: selectedRadio === 'CMS1' ? '#09771a' : (selectedRadio === 'CMS2' ? '#d0147e' : '#1890ff'),
          borderColor: '#fff',
          borderWidth: 2,
        },
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        smooth: true,
      };

      this.option = {
        grid: {
          left: 60,
          top: 60,
          right: 40,
          bottom: 80,
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          offset: 5,
          data: workersData.map(data => data[0]),
          axisLabel: {
            interval: 0,
            rotate: -45,
            textStyle: {
              fontSize: 10,
            },
          },
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: '#999',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              fontSize: 12,
            },
          },
          axisLine: {
            lineStyle: {
              color: '#999',
            },
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#ddd',
            },
          },
          animation: true,
        },
        series: [seriesData],
      };

      if (this.echartsInstance) {
        this.echartsInstance.off('click');
        this.echartsInstance.on('click', 'series', (params: any) => {
          const selectedDate = params.value[0];
          const formattedDate = moment(selectedDate, 'YYYY:MM:DD HH:mm:ss').format('YYYY-MM-DD');
          this.workersService.getWorkersByDate(formattedDate).subscribe((workers: Worker[]) => {
            this.open(selectedDate, workers);
          });
        });
      }
    });
  }

  private fetchPostes(): void {
    this.workersService.getPostes().subscribe(
      (postes) => {
        this.postes = postes;
      },
      (error) => {
        console.error('Error fetching postes:', error);
      }
    );
  }

  open(selectedDate: string, workers: Worker[]) {
    this.dialogOpened = true;
    const formattedDate = moment(selectedDate, 'YYYY:MM:DD HH:mm:ss').format('YYYY-MM-DD');
    this.workersService.getWorkersByDate(formattedDate).subscribe((workers: Worker[]) => {
      const dialogData: DialogData = {
        title: 'Worker Details',
        selectedDate: formattedDate,
        workers: workers,
      };
      setTimeout(() => {
        this.dialogService.open(WorkerchartListComponent, {
          context: dialogData,
        }).onClose.subscribe(() => {
          this.dialogOpened = false;
        });
      }, 100);
    });
  }

  onChartInit(echarts) {
    this.echartsInstance = echarts;
  }

  resizeChart() {
    if (this.echartsInstance) {
      setTimeout(() => {
        this.echartsInstance.resize();
      }, 0);
    }
  }
}
