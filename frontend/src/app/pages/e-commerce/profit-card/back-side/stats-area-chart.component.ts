import {AfterViewInit, Component, Input, OnDestroy, Renderer2, SimpleChanges, TemplateRef} from '@angular/core';
import { NbDialogService, NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../../@core/utils';
import { OrdersChart } from '../../../../@core/data/orders-chart';
import { Poste } from '../../../../models/Poste.model';
import { OrdersChartService } from '../../../../@core/mock/orders-chart.service';
import { WorkersService } from '../../../../services/workers.service';
import { Worker } from '../../../../models/worker.model';
import * as moment from 'moment';
import { DialogData } from '../../../../models/DialogData.model';
import { ShowcaseDialogComponent } from '../../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-stats-ares-chart',
  styleUrls: ['stats-card-back.component.scss'],
  template: `
    <div echarts
         *ngIf="option"
         [options]="option"
         [merge]="option"
         class="echart"
         style="width: 100%; height: 270px;"
    (chartInit)="onChartInit($event)">
    </div>
    <div *ngIf="ordersChartData && ordersChartData.chartLabel">
      <ul>
      </ul>
    </div>
    <div *ngIf="ordersChartData && ordersChartData.linesData">
      <ul>
      </ul>
    </div>
    <div *ngIf="chartDataAvailable">
      <ul>
      </ul>
    </div>
    <div *ngIf="chartDataAvailable">
      <ul>
      </ul>
    </div>

  `,
})
export class StatsAreaChartComponent implements AfterViewInit, OnDestroy {

  @Input() ordersChartData: OrdersChart;
  echartsIntance: any;
  option: any;
  chartDataAvailable = true;
  selectedRadio: string = 'All';
  postes: Poste[] = [];
  dialogOpened: boolean = false;
  dialog: TemplateRef<any>;

  constructor(
    private theme: NbThemeService,
    private layoutService: LayoutService,
    private ordersChartService: OrdersChartService,
    private workersService: WorkersService,
    private renderer: Renderer2,
    private dialogService: NbDialogService,
  ) {
    this.layoutService.onSafeChangeLayoutSize().subscribe(() => this.resizeChart());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ordersChartData && changes.ordersChartData.currentValue) {
      this.updateOrdersChartOptions();
    }
  }

  ngAfterViewInit(): void {
    this.initializeChartOptions();
    this.triggerDropdownOnWindowLoad();
    this.fetchPostes();
    this.selectedRadio = 'All';
    this.handleFilterChange('All');
  }

  private triggerDropdownOnWindowLoad(): void {
    this.renderer.listen('window', 'load', () => {
      const dropdownToggle = document.querySelector('[data-dropdown-toggle="dropdown"]') as HTMLElement;
      if (dropdownToggle) {
        dropdownToggle.click();
      }
    });
  }

  private initializeChartOptions(): void {
    this.theme.getJsTheme().subscribe(config => {
      const eTheme: any = config.variables.orders;
      this.setOptions(eTheme);
    });
  }

  private updateOrdersChartOptions(): void {
    if (!this.option || !this.ordersChartData || !this.ordersChartData.chartLabel) {
      return;
    }

    this.option.xAxis.data = this.ordersChartData.chartLabel;
  }

  private setOptions(selectedRadio: string | Worker[]) {
    // If selectedRadio is of type string, fetch data based on the selected poste
    if (typeof selectedRadio === 'string') {
      const posteName = selectedRadio;
      this.workersService.getWorkersByTodayDateAndPoste(posteName).subscribe((workers: Worker[]) => {
        workers.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const workersData = workers.map(worker => [
          moment.utc(worker.date).format('HH:mm:ss'),
          worker.chargeEsd,
        ]);

        workersData.sort((a, b) => {
          const timeA = moment(a[0], 'HH:mm:ss');
          const timeB = moment(b[0], 'HH:mm:ss');
          return timeA.diff(timeB);
        });

        const seriesData = {
          type: 'bar',
          data: workersData,
          lineStyle: {
            color: posteName === 'Integration' ? '#ee0a1f' : posteName === 'CMS1' ?
              '#66ff33' : (posteName === 'CMS2' ? '#b117d3' : '#0df4f5'),
            width: 5,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: posteName === 'Integration' ? 'rgba(238, 10, 31, 0.8)' : posteName === 'CMS1' ? 'rgba(102, 255, 51, 0.7)' : (posteName === 'CMS2' ? 'rgba(177, 23, 211,0.7)' : 'rgba(13, 244, 245, 0.7)'),
            }, {
              offset: 1,
              color: 'rgba(13, 244, 245, 0)',
            }]),
          },
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: posteName === 'CMS1' ? '#09771a' : (posteName === 'CMS2' ? '#d0147e' : '#1890ff'),
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
              formatter: function (value) {
                return value;
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

        if (this.echartsIntance) {
          this.echartsIntance.off('click');
          this.echartsIntance.on('click', 'series', (params: any) => {
            const selectedDate = params.value[0];
            const formattedDate = moment(selectedDate, 'HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');

            this.workersService.getWorkersByExactDateTime(formattedDate).subscribe((workers: Worker[]) => {
              this.open(selectedDate, workers);
            });
          });
        }
      });
    } else { // If selectedRadio is of type Worker[], it means 'All' is selected
      const workers = selectedRadio as Worker[];
      workers.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const workersData = workers.map(worker => [
        moment.utc(worker.date).format('HH:mm:ss'),
        worker.chargeEsd,
      ]);

      workersData.sort((a, b) => {
        const timeA = moment(a[0], 'HH:mm:ss');
        const timeB = moment(b[0], 'HH:mm:ss');
        return timeA.diff(timeB);
      });

      const seriesData = {
        type: 'bar',
        data: workersData,
        lineStyle: {
          color: '#5af50d',
          width: 5,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#5af50d',
          }, {
            offset: 1,
            color: 'rgba(13, 244, 245, 0)',
          }]),
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#1890ff',
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
            formatter: function (value) {
              return value;
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

      if (this.echartsIntance) {
        this.echartsIntance.off('click');
        this.echartsIntance.on('click', 'series', (params: any) => {
          const selectedDate = params.value[0];
          const formattedDate = moment(selectedDate, 'HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');

          this.workersService.getWorkersByExactDateTime(formattedDate).subscribe((workers: Worker[]) => {
            this.open(selectedDate, workers);
          });
        });
      }
    }
    // Log the options
    // console.log('Options:', this.option);
  }


  handleFilterChange(value: string) {
    if (value === 'All') {
      this.workersService.getWorkersWithTodayDate().subscribe((workers: Worker[]) => {
        this.setOptions(workers);
      });
    } else {
      this.selectedRadio = value;
      this.setOptions(value);
    }
  }

  open(selectedDate: string, workers: Worker[]) {
    this.dialogOpened = true;

    const formattedDate = moment(selectedDate, 'HH:mm:ss').format('YYYY-MM-DDTHH:mm:ss');

    this.workersService.getWorkersByExactDateTime(formattedDate).subscribe((workers: Worker[]) => {
      console.log('Workers received:', workers);

      const dialogData: DialogData = {
        title: '',
        selectedDate: formattedDate,
        workers: workers,
      };

      setTimeout(() => {
        this.dialogService.open(ShowcaseDialogComponent, {
          context: dialogData,
        }).onClose.subscribe(() => {
          this.dialogOpened = false;
        });
      }, 100);
    }, error => {
      console.error('Error fetching workers:', error);
    });
  }

  onChartInit(echarts) {
    this.echartsIntance = echarts;
    this.resizeChart(); // Resize chart once initialized
  }

  resizeChart() {
    if (this.echartsIntance) {
      setTimeout(() => {
        this.echartsIntance.resize();
      }, 0);
    }
  }

  fetchPostes(): void {
    this.workersService.getPostes().subscribe(
      (postes) => {
        this.postes = postes;
      },
      (error) => {
        console.error('Error fetching postes:', error);
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from layout size changes
  //  this.layoutService.onSafeChangeLayoutSize().unsubscribe();
  }
}
