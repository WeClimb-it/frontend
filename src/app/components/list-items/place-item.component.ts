import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Place } from 'src/app/interfaces/graphql';
import { ContentType } from 'src/app/utils/ContentType';

import { BaseListItemComponent } from './base-item.component';

@Component({
  selector: 'wci-place-list-item',
  templateUrl: 'place-item.component.html',
  styleUrls: ['place-item.component.scss'],
})
export class PlaceListItemComponent extends BaseListItemComponent implements OnInit {
  @Input() data: Place;

  protected itemSection = ContentType.PLACES;

  constructor(protected router: Router, public dialog: MatDialog) {
    super(router, dialog);
  }

  ngOnInit() {}
}
