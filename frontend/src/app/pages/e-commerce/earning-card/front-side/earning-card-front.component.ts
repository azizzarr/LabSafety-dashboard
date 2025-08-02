import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import {interval, Observable, Subscription} from 'rxjs';
import {delay, map, switchMap, takeWhile} from 'rxjs/operators';
import { LiveUpdateChart, EarningData } from '../../../../@core/data/earning';
import {WorkersService} from '../../../../services/workers.service';
import {LayoutService} from '../../../../@core/utils';

@Component({
  selector: 'ngx-earning-card-front',
  styleUrls: ['./earning-card-front.component.scss'],
  templateUrl: './earning-card-front.component.html',

})
export class EarningCardFrontComponent  implements OnDestroy, OnInit, OnChanges, AfterViewInit {
  private alive = true;

  @Input() selectedCurrency: string = 'Bitcoin';
  echartsInstance: any;
  intervalSubscription: Subscription;
  posts: string[] = ['poste1', 'poste2', 'poste3'];
  currencies: string[] = ['poste1', 'Tether', 'Ethereum'];
  currentTheme: string;
  earningLiveUpdateCardData: any;
  liveUpdateChartData: { value: [string, number] }[];
  option: any;
  private theme: any;

  constructor(private themeService: NbThemeService,
              private earningService: EarningData,
              private workersService: WorkersService,
  private layoutService: LayoutService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
    this.layoutService.onSafeChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngOnInit() {
    this.startReceivingLiveData();
   this.earningLiveUpdateCardData = [
      { value: ['2024-01-01', 100] },
      { value: ['2024-01-02', 150] },
      { value: ['2024-01-03', 200] },
      // Add more static data as needed
    ];

  }

  changeCurrency(currency) {
    if (this.selectedCurrency !== currency) {
      this.selectedCurrency = currency;

    // this.getEarningCardData(this.selectedCurrency);
    }
  }

  getEarningCardData(): Observable<{ value: [string, number] }[]> {
    return this.earningService.getEarningLiveUpdateCardData();
  }


  startReceivingLiveData(): void {
    this.earningService.getEarningLiveUpdateCardData().subscribe(
      (data: { value: [string, number] }[]) => {
      //  console.log('Received raw data:', data);

        this.liveUpdateChartData = data.map(chartData => ({
          value: [chartData.value[0], chartData.value[1]],
        }));

      //  console.log('Formatted liveUpdateChartData:', this.liveUpdateChartData);
      },
      (error) => {
     //   console.error('Error fetching live update chart data:', error);
      },
      () => {
      //  console.log('Live update chart data subscription completed.');
      },
    );
  }
  setChartOption(earningLineTheme) {
    this.option = {
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      xAxis: {
        type: 'time',
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        boundaryGap: [0, '5%'],
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        textStyle: {
          color: earningLineTheme.tooltipTextColor,
          fontWeight: earningLineTheme.tooltipFontWeight,
          fontSize: earningLineTheme.tooltipFontSize,
        },
        position: 'top',
        backgroundColor: earningLineTheme.tooltipBg,
        borderColor: earningLineTheme.tooltipBorderColor,
        borderWidth: earningLineTheme.tooltipBorderWidth,
        formatter: params => ` ${Math.round(parseInt(params.value[1], 10))}`,
        extraCssText: earningLineTheme.tooltipExtraCss,
      },
      series: [
        {
          type: 'line', // Specify the type property
          symbol: 'circle',
          sampling: 'average',
          itemStyle: {
            normal: {
              opacity: 0,
            },
            emphasis: {
              opacity: 0,
            },
          },
          lineStyle: {
            normal: {
              width: 0,
            },
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: earningLineTheme.gradFrom,
              }, {
                offset: 1,
                color: earningLineTheme.gradTo,
              }]),
              opacity: 1,
            },
          },
         // data: this.liveUpdateChartData,
          data: this.earningLiveUpdateCardData,
        },
      ],
      animation: true,
    };
   // console.log('ice creammmmm:', this.earningLiveUpdateCardData);
  }

  ngOnDestroy() {
    this.alive = false;
  }
  resizeChart() {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(
        delay(1),
        takeWhile(() => this.alive),
      )
      .subscribe(config => {
        const earningLineTheme: any = config.variables.earningLine;
        this.setChartOption(earningLineTheme); // Pass the earningLineTheme here
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
