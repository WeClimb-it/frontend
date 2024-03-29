import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

// tslint:disable-next-line: no-string-literal
const Skycons = (window && window['Skycons']) || {};

@Component({
  selector: 'wci-skycon',
  template: `<canvas #skycon id="{{ id }}" width="{{ width }}" height="{{ height }}"></canvas>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyconComponent implements AfterViewInit, OnDestroy {
  @Input() width: number;
  @Input() height: number;
  @Input() icon: string;
  @Input() color: string;
  @Input() animate = false;
  @ViewChild('skycon') iconRef: ElementRef;

  skycons;

  id = Math.random().toString(36).substr(2, 5);

  ngAfterViewInit(): void {
    this.skycons = new Skycons({ color: this.color || 'white' });
    this.skycons.add(this.iconRef.nativeElement, this.icon);
    if (this.animate) {
      this.skycons.play();
    }
  }

  ngOnDestroy(): void {
    if (this.animate) {
      this.skycons.pause();
    }
    this.skycons.remove(this.id);
  }
}
