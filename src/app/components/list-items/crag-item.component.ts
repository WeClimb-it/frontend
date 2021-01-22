import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import moment from 'moment-timezone';
import { Crag } from 'src/app/interfaces/graphql';
import { ContentType } from 'src/app/utils/ContentType';

import { BaseListItemComponent } from './base-item.component';

@Component({
  selector: 'wci-crag-list-item',
  templateUrl: 'crag-item.component.html',
  styleUrls: ['crag-item.component.scss'],
})
export class CragListItemComponent extends BaseListItemComponent implements OnInit {
  @Input() data: Crag;

  ROUTES_COUNT_GOOD_THRESHOLD = 20;
  ROUTES_COUNT_AWESOME_THRESHOLD = 60;

  currentMonth = new Date().getMonth();
  currentMonthHuman = moment().format('MMMM');

  protected itemSection = ContentType.CRAGS;

  constructor(protected router: Router, public dialog: MatDialog) {
    super(router, dialog);
  }

  ngOnInit() {}
}
