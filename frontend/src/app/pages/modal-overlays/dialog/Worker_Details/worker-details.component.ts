import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { NbDialogRef, NbDialogService, NbThemeService } from '@nebular/theme';
import { WorkersService } from '../../../../services/workers.service';
import { Worker } from '../../../../models/worker.model';
import * as echarts from 'echarts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'worker-details.component.html',
  styleUrls: ['worker-details.component.scss'],
})
export class WorkerDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('content', { static: false }) content: ElementRef;

  @Input() title: string;
  @Input() matricule: string;
  options: any = {};
  themeSubscription: any;
  workers: Worker[] = [];
  averageChargeEsd: string | null = null;
  constructor(
    protected ref: NbDialogRef<WorkerDetailsComponent>,
    private cdr: ChangeDetectorRef,
    private theme: NbThemeService,
    private workersService: WorkersService,
  ) {}

  ngOnInit() {
    if (this.matricule) {
      this.fetchWorkersData(this.matricule);
    } else {
      console.error('Matricule is not provided!');
    }
    this.fetchAverageChargeEsd(this.matricule);
  }

  fetchWorkersData(matricule: string): void {
    this.workersService.getWorkersByMatricule(matricule).subscribe(
      (data: Worker[]) => {
        this.workers = data;
        this.processWorkersData();
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching workers data:', error);
      },
    );
  }

  processWorkersData() {
    if (this.workers.length > 0) {
      this.workers.sort((a, b) => {
        const dateA = new Date(a.date[0], a.date[1] - 1, a.date[2], a.date[3], a.date[4], a.date[5]).getTime();
        const dateB = new Date(b.date[0], b.date[1] - 1, b.date[2], b.date[3], b.date[4], b.date[5]).getTime();
        return dateA - dateB;
      });

      const dates = this.workers.map(worker => {
        const date = new Date(worker.date[0], worker.date[1] - 1,
          worker.date[2], worker.date[3], worker.date[4], worker.date[5]);
        return date.toLocaleString('en-GB', { year: 'numeric', month:
            '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
          second: '2-digit' }).replace(',', '');
      });

      const charges = this.workers.map(worker => worker.chargeEsd);

      this.setChartOptions(dates, charges);
    }
  }
  formatDate(dateArray: number[]): string {
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
    return date.toLocaleString('en-GB', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).replace(',', '');
  }
  formatPostes(postes: any[]): string {
    return postes.map(poste => poste.name).join(', ');
  }
  setChartOptions(dates: string[], charges: number[]) {
    const data = dates.map((date, index) => ({ date, charge: charges[index] }));

    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echartsTheme: any = config.variables.echarts;

      this.options = {
        backgroundColor: echartsTheme.bg,
        color: [colors.danger, colors.primary, colors.info],
        tooltip: {
          trigger: 'axis',
          formatter: '{a} <br/>{b} : {c}',
          backgroundColor: 'rgba(50, 50, 50, 0.7)',
          borderColor: '#333',
          textStyle: {
            color: '#fff',
          },
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.date), // Use the sorted dates
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: echartsTheme.axisLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: echartsTheme.textColor,
            },
            rotate: -45,
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: echartsTheme.axisLineColor,
            },
          },
          splitLine: {
            lineStyle: {
              color: echartsTheme.splitLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: echartsTheme.textColor,
            },
          },
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true,
        },
        series: [
          {
            name: 'Charge ESD',
            type: 'line',
            data: data.map(item => item.charge), // Use the corresponding charges
            lineStyle: {
              color: colors.primary,
              width: 2,
            },
            itemStyle: {
              color: colors.primary,
              borderColor: '#fff',
              borderWidth: 2,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(0, 136, 212, 0.5)' },
                { offset: 1, color: 'rgba(0, 136, 212, 0.05)' },
              ]),
            },
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            animationDuration: 1000,
            animationEasing: 'cubicOut',
          },
        ],
      };
    });
  }

  exportToPdf(): void {
    html2canvas(this.content.nativeElement).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');

      const pdf = new jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      // Load the logo image
      const logo = new Image();
      logo.src = 'assets/images/sagemcom.png'; // Use relative URL to access the image in assets

      logo.onload = () => {
        const logoWidth = 22; // Width of the logo
        const logoHeight = 22; // Height of the logo
        const logoX = 10; // X position of the logo
        const logoY = 5; // Y position of the logo

        // Add the logo to the PDF
        pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);

        // Calculate the Y position to start the content below the logo
        const contentY = logoY + logoHeight + 10; // 10 units space below the logo

        // Add the content screenshot to the PDF
        pdf.addImage(contentDataURL, 'PNG', 0, contentY, width, height - contentY);
        pdf.save('worker-details.pdf');
      };
    });
  }
  fetchAverageChargeEsd(matricule: string): void {
    this.workersService.getAverageChargeEsdByMatricule(matricule).subscribe(
      (data: string) => {
        this.averageChargeEsd = data;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching average charge ESD:', error);
      },
    );
  }



  dismiss() {
    this.ref.close();
  }

  ngAfterViewInit() {}

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
