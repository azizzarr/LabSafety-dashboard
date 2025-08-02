import { Component, AfterViewInit, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { LayoutService } from '../../../../@core/utils/layout.service';
import { WorkersService } from '../../../../services/workers.service';
import { DialogNamePromptComponent } from '../../../modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';

declare const echarts: any;

@Component({
  selector: 'ngx-traffic-bar-chart',
  template: `
    <div echarts
         [options]="option"
         class="echart"
         (chartInit)="onChartInit($event)">
    </div>
  `,
})
export class TrafficBarChartComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() data: Map<string, any>;
  @Output() barClick: EventEmitter<any> = new EventEmitter<any>(); // Event emitter for bar click
  private alive = true;
  option: any = {};
  echartsInstance: any;
  trafficTheme: any;

  constructor(
    private theme: NbThemeService,
    private layoutService: LayoutService,
    private workersService: WorkersService,
    private dialogService: NbDialogService,
  ) {
    this.layoutService.onSafeChangeLayoutSize()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => this.resizeChart());
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
    this.setupChartEventHandlers(); // Call method to set up event handlers
  }

  ngOnInit() {
    this.getStatisticsForLastWeek();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        this.trafficTheme = config.variables.trafficBarEchart;
      });
  }

  resizeChart() {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }

  getStatisticsForLastWeek() {
    this.workersService.getStatisticsForLastWeek()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data: Map<string, any>) => { // Update data type to Map
        this.updateChart(data);
      });
  }

  updateChart(data: Map<string, any> | any) {
  //  console.log('Received data:', data);

    let labels;
    if (data instanceof Map) {
      labels = Array.from(data.keys());
    } else if (typeof data === 'object') {
      labels = Object.keys(data);
    } else {
      console.error('Unsupported data type:', typeof data);
      return;
    }

   // console.log('Labels:', labels);

    const seriesData = labels.map(date => {
      const item = data instanceof Map ? data.get(date) : data[date];
   //   console.log('Item:', item);

      const averageChargeEsd = parseFloat(item.averageChargeEsd);
      const under40Percentage = parseFloat(item.under40Percentage);
      const between40And80Percentage = parseFloat(item.between40And80Percentage);
      const over80Percentage = parseFloat(item.over80Percentage);

      // Define colors based on average charge ESD
      let color;
      if (averageChargeEsd < 40) {
        color = 'green';
      } else if (averageChargeEsd >= 40 && averageChargeEsd <= 80) {
        color = 'blue';
      } else {
        color = 'red';
      }

      return {
        value: averageChargeEsd,
        itemStyle: {
          color: color,
        },
        // Additional properties for tooltip formatting
        tooltip: {
          formatter: `{a}<br />Average Charge ESD: ${averageChargeEsd}<br />Under 40%: ${under40Percentage}%<br />40%-80%: ${between40And80Percentage}%<br />Over 80%: ${over80Percentage}%`
        },
      };
    });

   // console.log('Series data:', seriesData);

    this.option = {
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: {
          color: this.trafficTheme.axisTextColor,
          fontSize: this.trafficTheme.axisFontSize,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        show: false,
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        boundaryGap: [0, '5%'],
      },
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        textStyle: {
          color: this.trafficTheme.tooltipTextColor,
          fontWeight: this.trafficTheme.tooltipFontWeight,
          fontSize: 16,
        },
        position: 'top',
        backgroundColor: this.trafficTheme.tooltipBg,
        borderColor: this.trafficTheme.tooltipBorderColor,
        borderWidth: 1,
      },
      series: [
        {
          type: 'bar',
          barWidth: '40%',
          data: seriesData,
          itemStyle: {
            normal: {
              opacity: 1,
              shadowColor: this.trafficTheme.gradientFrom,
              shadowBlur: this.trafficTheme.shadowBlur,
            },
          },
        },
      ],
    };

    if (this.echartsInstance) {
     // console.log('Setting chart option...');
      this.echartsInstance.setOption(this.option);
    }
  }

   setupChartEventHandlers() {
    if (this.echartsInstance) {
      // Set up event handler for bar click
      this.echartsInstance.on('click', (params) => {
     //   console.log('Bar clicked:', params);
        this.handleBarClick(params); // Call method to handle bar click
      });
    }
  }

  handleBarClick(params: any) {
    // Extract the clicked date from the params object
    const clickedDate = params.name;

 //   console.log('Clicked bar date:', clickedDate);

    // Fetch statistics for the clicked date directly from WorkersService
    this.workersService.getStatisticsForLastWeek().subscribe((data: any) => {
   //   console.log('Data retrieved from WorkersService:', data); // Log the retrieved data

      // Check if data is an object
      if (typeof data === 'object' && data !== null) {
        // Check if the clicked date exists in the data object
        if (data.hasOwnProperty(clickedDate)) {
          const clickedDateStats = data[clickedDate];
        //  console.log('Clicked date statistics:', clickedDateStats);

          const { between40And80Percentage, averageChargeEsd, under40Percentage, over80Percentage } = clickedDateStats;

          // Open the dialog and pass the statistics to it
          this.openWithData({
            title: clickedDate, // Assuming date as the title
            between40And80Percentage,
            averageChargeEsd,
            under40Percentage,
            over80Percentage
          });
        } else {
        //  console.error('No statistics found for the clicked date:', clickedDate);
        }
      } else {
      //  console.error('Data received from WorkersService is not an object or is null.');
      }
    });
  }






  openWithData(data: any) {
    this.dialogService.open(DialogNamePromptComponent, {
      context: data,
    });
  }



}
