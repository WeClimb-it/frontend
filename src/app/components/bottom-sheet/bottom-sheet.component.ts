import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

export interface BottomSheetData {
  thumbnail: string;
  title: string;
  description: string;
  url: string;
  onClose: () => void;
}

@Component({
  selector: 'wci-bottom-sheet',
  templateUrl: 'bottom-sheet.component.html',
  styleUrls: ['bottom-sheet.component.scss'],
})
export class BottomSheetComponent {
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    private router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: BottomSheetData,
  ) {}

  onCardClicked(): void {
    this.router.navigate([this.data.url]);
  }

  onClose(event: MouseEvent): void {
    this.close();

    if (typeof this.data.onClose === 'function') {
      this.data.onClose();
    }

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  private close(): void {
    this._bottomSheetRef.dismiss();
  }
}
