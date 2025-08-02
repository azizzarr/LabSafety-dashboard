import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { ProgressInfo, StatsProgressBarData } from '../data/stats-progress-bar';

@Injectable()
export class StatsProgressBarService extends StatsProgressBarData {
  private progressInfoData: ProgressInfo[] = [
    {
      title: 'demandes de changement des chaussures',
      value: 572,
      activeProgress: 70,
      description: 'Better than last week (70%)',
    },
    {
      title: 'Validé',
      value: 68,
      activeProgress: 30,
      description: 'Better than last week (30%)',
    },
    {
      title: 'en cours de traitement',
      value: 20,
      activeProgress: 55,
      description: 'Better than last week (55%)',
    },
  ];

  getProgressInfoData(): Observable<ProgressInfo[]> {
    return observableOf(this.progressInfoData);
  }
}
