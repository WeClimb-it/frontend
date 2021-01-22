import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Hike } from 'src/app/interfaces/graphql';
import { ContentType } from 'src/app/utils/ContentType';

import { BaseListItemComponent } from './base-item.component';

@Component({
  selector: 'wci-hike-list-item',
  templateUrl: 'hike-item.component.html',
  styleUrls: ['hike-item.component.scss'],
})
export class HikeListItemComponent extends BaseListItemComponent implements OnInit {
  @Input() data: Hike;

  protected itemSection = ContentType.HIKES;

  constructor(protected router: Router, public dialog: MatDialog) {
    super(router, dialog);
  }

  ngOnInit() {}
}
