import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

import { TrafficList } from '../../../../@core/data/traffic-list';
import {WorkersService} from '../../../../services/workers.service';
interface WorkerTraffic {
  date: string;
  workersCount: number;
  averageChargeEsd: number;
  change: string;
  prevDay: string;
}
@Component({
  selector: 'ngx-traffic-front-card',
  styleUrls: ['./traffic-front-card.component.scss'],
  templateUrl: './traffic-front-card.component.html',
})
export class TrafficFrontCardComponent implements OnDestroy, OnInit {

  private alive = true;
  @Input() frontCardData: TrafficList;
  daysWithData: WorkerTraffic[];
  currentTheme: string;

  constructor(private themeService: NbThemeService, private workersService: WorkersService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
    });
  }
  trackByDate(_, item) {
    return item.date;
  }
  ngOnInit() {
    this.getWorkersAndAverageChargeEsdByDayInLastWeek();
  }
  ngOnDestroy() {
    this.alive = false;
  }
  getWorkersAndAverageChargeEsdByDayInLastWeek() {
    this.workersService.getWorkersAndAverageChargeEsdByDayInLastWeek()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data: { [key: string]: any }) => {
        this.daysWithData = Object.entries(data).map(([date, values]) => ({
          date,
          workersCount: values.workersCount,
          averageChargeEsd: values.averageChargeEsd,
          change: values.change,
          prevDay: values.prevDay,
        }));
      });
  }
}
