import {delay, map, pluck, switchMap, take, takeWhile} from 'rxjs/operators';
import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../../@core/utils/layout.service';
import {interval, Observable, Subscription} from 'rxjs';
import {EarningService} from '../../../../@core/mock/earning.service';
import {LiveUpdateChart} from '../../../../@core/data/earning';
import {WorkersService} from '../../../../services/workers.service';
import { WebSocketService } from '../../../../services/web-socket.service';
@Component({
  selector: 'ngx-earning-live-update-chart',
  styleUrls: ['earning-card-front.component.scss'],
  template: `
    <div echarts
         class="echart"
         [options]="option"
         (chartInit)="onChartInit($event)"></div>
  `,
})
export class EarningLiveUpdateChartComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {
  private alive = true;
  private intervalSubscription: Subscription;
  private subscription: Subscription;
  earningLiveUpdateCardData: LiveUpdateChart[];
  @Input() liveUpdateChartData: { value: any }[];
  option: any;
  echartsInstance: any;
  testtest: any;

  constructor(private theme: NbThemeService,
              private layoutService: LayoutService,
              private earningService: EarningService,
              private workersService: WorkersService,
              private webSocketService: WebSocketService) {
    this.layoutService.onSafeChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngOnInit() {
    // this.startReceivingLiveData();   hedhi eli badeltha bech nahi aka barcha logs el mokerza
    /* this.testtest = [
       { value: ['2024-01-01', 100] },
       { value: ['2024-01-02', 150] },
       { value: ['2024-01-03', 200] },
       { value: ['2024-01-04', 210] },
       { value: ['2024-01-05', 220] },
       { value: ['2024-01-06', 400] },
       { value: ['2024-01-07', 439] },
       { value: ['2024-01-08', 250] },
       { value: ['2024-01-09', 260] },
       { value: ['2024-01-10', 270] },
       { value: ['2024-01-11', 280] },
       { value: ['2024-01-12', 290] },
       { value: ['2024-01-13', 300] },


       // Add more static data as needed
     ];*/
    this.getEarningLiveUpdateCardData().then(data => {
      // Handle the resolved data here
      //  console.log('Earning live update card data:', data);
    }).catch(error => {
      // Handle errors if any
      console.error('Error fetching earning live update card data:', error);
    });
    this.subscription = this.webSocketService.getChartData().subscribe(data => {
      this.liveUpdateChartData.push(data);
      this.getEarningLiveUpdateCardData(); // Call a method to update your chart with the new data
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.liveUpdateChartData && this.option) {
      const data = changes.liveUpdateChartData.currentValue;
      if (data) {
        // console.log('Data:', data); // Log the structure of the data object
        const formattedData = data.map(item => ({
          value: [item.value[0], item.value[1]],
        }));
        //   console.log('Formatted Data:', formattedData);
        this.updateChartOptions(formattedData);
      } else {
        console.log('Live update chart data is null or undefined.');
      }
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

  getEarningLiveUpdateCardData(): Promise<[string, number][]> {
    return this.workersService.getWorkersByLast7Days().pipe(
      delay(1000),
      map(workers => {
        return workers.map(worker => {
          const dateArray = worker.date;
          const formattedDate = `${dateArray[0]}-${(dateArray[1] + 1).toString().padStart(2, '0')}-${dateArray[2].toString().padStart(2, '0')}`;
          // console.log('formatted date:', formattedDate); // Log the formatted date
          // console.log('raw date:', worker.date);
          return [formattedDate, worker.chargeEsd] as [string, number];
        });
      })
    ).toPromise();
  }


  startReceivingLiveData(): void {
    interval(5000) // Fetch data every 5 seconds
      .pipe(
        takeWhile(() => this.alive)
      )
      .subscribe(() => {
        this.getEarningLiveUpdateCardData().then(data => {
          this.updateChartData(data);
        }).catch(error => {
          console.error('Error fetching earning live update card data:', error);
        });
      });

  }

  updateChartData(data: [string, number][]): void {
    data.sort((a, b) => {
      const dateA = new Date(a[0]).getTime();
      const dateB = new Date(b[0]).getTime();
      return dateA - dateB;
    });

    if (this.echartsInstance && this.option) {
      this.option.series[0].data = data; // Update the chart data
      this.echartsInstance.setOption(this.option); // Update the chart with new data
    }
  }









  async setChartOption(earningLineTheme) {
    try {
      const data = await this.getEarningLiveUpdateCardData(); // Resolve the Promise
      //  console.log('ice creammmmm:', data); // Log the resolved data

      // Sort the data based on the date (assuming the date is the first element of each item in the array)
      data.sort((a, b) => {
        const dateA = new Date(a[0]).getTime();
        const dateB = new Date(b[0]).getTime();
        return dateA - dateB;
      });

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
            type: 'line',
            symbol: 'circle',
            sampling: 'average',
            smooth: true, // Add this line to make the line smoother
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
            data: data, // Use the sorted data
          },
        ],

        animation: true,
      };
    } catch (error) {
      console.error('Error fetching earning live update card data:', error);
    }
  }





  updateChartOptions(chartData: number[]): void {
    if (this.echartsInstance) {
      this.echartsInstance.setOption({
        series: [{ data: chartData }],
      });
    }
  }

  onChartInit(ec): void {
    this.echartsInstance = ec;
    if (this.liveUpdateChartData) {
      const formattedChartData = this.liveUpdateChartData.map(data => data.value[1]);
      this.updateChartOptions(formattedChartData);
    }
  }


  ngOnDestroy(): void {
    this.alive = false;
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  resizeChart() {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }
}



