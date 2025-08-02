/*import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-earning-pie-chart',
  styleUrls: ['./earning-card-back.component.scss'],
  template: `
    <div echarts
         class="echart"
         [options]="options"
         (chartInit)="onChartInit($event)"
         (chartClick)="onChartClick($event)">
    </div>
  `,
})
export class EarningPieChartComponent implements AfterViewInit, OnDestroy {

  @Output() selectPie = new EventEmitter<{ value: number; name: string; color: string }>();
  @Input() values: { value: number; name: string; }[];
  @Input() defaultSelectedCurrency: string;

  private alive = true;

  options: any = {};
  echartsInstance;

  constructor(private theme: NbThemeService) {
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  onChartClick(event) {
    const pieData = {
      value: event.value,
      name: event.name,
      color: event.color.colorStops[0].color,
    };

    this.emitSelectPie(pieData);
  }

  emitSelectPie(pieData: { value: number; name: string; color: any }) {
    this.selectPie.emit(pieData);
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(
        takeWhile(() => this.alive),
        delay(1),
      )
      .subscribe(config => {
        const variables = config.variables;

        this.options = this.getOptions(variables);
        const defaultSelectedData =
          this.options.series[0].data.find((item) => item.name === this.defaultSelectedCurrency);
        const color = defaultSelectedData.itemStyle.normal.color.colorStops[0].color;
        const pieData = {
          value: defaultSelectedData.value,
          name: defaultSelectedData.name,
          color,
        };

        this.emitSelectPie(pieData);
      });
  }

  getOptions(variables) {
    const earningPie: any = variables.earningPie;

    return {
      tooltip: {
        trigger: 'item',
        formatter: '',
      },
      series: [
        {
          name: ' ',
          clockWise: true,
          hoverAnimation: false,
          type: 'pie',
          center: earningPie.center,
          radius: earningPie.radius,
          data: [
            {
              value: this.values[0].value,
              name: this.values[0].name,
              label: {
                normal: {
                  position: 'center',
                  formatter: '',
                  textStyle: {
                    fontSize: '22',
                    fontFamily: variables.fontSecondary,
                    fontWeight: '600',
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: false,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: earningPie.firstPieGradientLeft,
                    },
                    {
                      offset: 1,
                      color: earningPie.firstPieGradientRight,
                    },
                  ]),
                  shadowColor: earningPie.firstPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 3,
                },
              },
            },
            {
              value: this.values[1].value,
              name: this.values[1].name,
              label: {
                normal: {
                  position: 'center',
                  formatter: '',
                  textStyle: {
                    fontSize: '22',
                    fontFamily: variables.fontSecondary,
                    fontWeight: '600',
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: false,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: earningPie.secondPieGradientLeft,
                    },
                    {
                      offset: 1,
                      color: earningPie.secondPieGradientRight,
                    },
                  ]),
                  shadowColor: earningPie.secondPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 3,
                },
              },
            },
            {
              value: this.values[2].value,
              name: this.values[2].name,
              label: {
                normal: {
                  position: 'center',
                  formatter: '',
                  textStyle: {
                    fontSize: '22',
                    fontFamily: variables.fontSecondary,
                    fontWeight: '600',
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: false,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: earningPie.thirdPieGradientLeft,
                    },
                    {
                      offset: 1,
                      color: earningPie.thirdPieGradientRight,
                    },
                  ]),
                  shadowColor: earningPie.thirdPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 3,
                },
              },
            },
          ],
        },
      ],
    };
  }

  ngOnDestroy() {
    this.alive = false;
  }
}*/
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';
import { WorkersService } from '../../../../services/workers.service';

@Component({
  selector: 'ngx-earning-pie-chart',
  styleUrls: ['./earning-card-back.component.scss'],
  template: `
    <div echarts
         class="echart"
         [options]="options"
         (chartInit)="onChartInit($event)"
         (chartClick)="onChartClick($event)">
    </div>
  `,
})
export class EarningPieChartComponent implements AfterViewInit, OnDestroy {

  @Output() selectPie = new EventEmitter<{value: number; name: string; color: string}>();
  @Input() values: {value: number; name: string; }[];
  @Input() defaultSelectedCurrency: string;

  private alive = true;

  options: any = {};
  echartsInstance;

  constructor(private theme: NbThemeService, private workerService: WorkersService) {
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  onChartClick(event) {
    const pieData = {
      value: event.value,
      name: event.name,
      color: event.color.colorStops[0].color,
    };

    this.emitSelectPie(pieData);
  }

  emitSelectPie(pieData: {value: number; name: string; color: any}) {
    this.selectPie.emit(pieData);
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(
        takeWhile(() => this.alive),
        delay(1),
      )
      .subscribe(config => {
        const variables = config.variables;

        // Fetch the count of all workers
        this.workerService.countAllWorkers().subscribe(totalWorkers => {
          // Fetch the count of workers with chargeEsd under 40
          this.workerService.countWorkersWithChargeEsdUnder40().subscribe(countUnder40 => {
            // Fetch the count of workers with chargeEsd between 40 and 80
            this.workerService.countWorkersWithChargeEsdBetween40And80().subscribe(countBetween40And80 => {
              // Fetch the count of workers with chargeEsd over 80
              this.workerService.countWorkersWithChargeEsdOver80().subscribe(countOver80 => {
                // Calculate percentages and round them to integers
                const under40Percent = Math.round((countUnder40 / totalWorkers) * 100);
                const between40And80Percent = Math.round((countBetween40And80 / totalWorkers) * 100);
                const over80Percent = Math.round((countOver80 / totalWorkers) * 100);

                console.log('Under 40%:', under40Percent);
                console.log('Between 40% and 80%:', between40And80Percent);
                console.log('Over 80%:', over80Percent);

                this.options = this.getOptions(variables, under40Percent, between40And80Percent, over80Percent);
              });
            });
          });
        });
      });
  }



  getOptions(variables, under40Percent, between40And80Percent, over80Percent) {
    const earningPie: any = variables.earningPie;

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      series: [
        {
          name: ' ',
          clockWise: true,
          hoverAnimation: false,
          type: 'pie',
          center: earningPie.center,
          radius: earningPie.radius,
          data: [
            {
              value: under40Percent,
              name: 'Safe',
              label: {
                normal: {
                  position: 'center',
                  formatter: '',
                  textStyle: {
                    fontSize: '22',
                    fontFamily: variables.fontSecondary,
                    fontWeight: '600',
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: false,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: earningPie.firstPieGradientLeft,
                    },
                    {
                      offset: 1,
                      color: earningPie.firstPieGradientRight,
                    },
                  ]),
                  shadowColor: earningPie.firstPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 3,
                },
              },
            },
            {
              value: between40And80Percent,
              name: 'Moderate',
              label: {
                normal: {
                  position: 'center',
                  formatter: '',
                  textStyle: {
                    fontSize: '22',
                    fontFamily: variables.fontSecondary,
                    fontWeight: '600',
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: true,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: earningPie.secondPieGradientLeft,
                    },
                    {
                      offset: 1,
                      color: earningPie.secondPieGradientRight,
                    },
                  ]),
                  shadowColor: earningPie.secondPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 3,
                },
              },
            },
            {
              value: over80Percent,
              name: 'Danger',
              label: {
                normal: {
                  position: 'center',
                  formatter: '',
                  textStyle: {
                    fontSize: '22',
                    fontFamily: variables.fontSecondary,
                    fontWeight: '600',
                    color: variables.fgHeading,
                  },
                },
              },
              tooltip: {
                show: false,
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'red',
                    },
                    {
                      offset: 1,
                      color: 'red',
                    },
                  ]),
                  shadowColor: earningPie.thirdPieShadowColor,
                  shadowBlur: 0,
                  shadowOffsetX: 0,
                  shadowOffsetY: 3,
                },
              },
            },
          ],
          label: {
            normal: {
              position: 'inner',
              formatter: '{d}%',
              textStyle: {
                fontSize: '14',
                fontWeight: 'bold',
              },
            },
          },
          itemStyle: {
            normal: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 10,
            },
          },
        },
      ],
    };
  }

  ngOnDestroy() {
    this.alive = false;
  }
}




