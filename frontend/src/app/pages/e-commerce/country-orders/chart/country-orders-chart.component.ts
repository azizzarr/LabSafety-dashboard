import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { WorkersService } from '../../../../services/workers.service'; // Update the path

@Component({
  selector: 'ngx-d3-advanced-pie',
  template: `
    <ngx-charts-advanced-pie-chart
      [scheme]="colorScheme"
      [results]="pieChartData">
    </ngx-charts-advanced-pie-chart>
  `,
})
export class CountryOrdersChartComponent implements OnDestroy {
  pieChartData: any[] = [];
  colorScheme: any;
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private workersService: WorkersService // Inject WorkersService
  ) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });

    // Fetch data when component initializes
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  fetchData() {
    this.workersService.countWorkersByPostNames()
      .subscribe(data => {
        // Map the fetched data into the format required by ngx-charts
        this.pieChartData = Object.keys(data).map(key => ({ name: key, value: data[key] }));
      });
  }
}
