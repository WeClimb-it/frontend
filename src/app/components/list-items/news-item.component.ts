import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { News } from 'src/app/interfaces/graphql';
import { ContentType } from 'src/app/utils/ContentType';

import { BaseListItemComponent } from './base-item.component';

@Component({
  selector: 'wci-news-list-item',
  templateUrl: 'news-item.component.html',
  styleUrls: ['news-item.component.scss'],
})
export class NewsListItemComponent extends BaseListItemComponent implements OnChanges {
  @Input() data: News;

  creationDate: Date;

  protected itemSection = ContentType.NEWS;

  constructor(protected router: Router) {
    super(router, undefined);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.currentValue && changes.data.currentValue !== changes.data.previousValue) {
      this.creationDate = new Date(changes.data.currentValue.creationTime);
    }
  }

  /**
   *
   */
  goToExternalNews(url: string): void {
    window.open(url, '_blank');
  }
}
