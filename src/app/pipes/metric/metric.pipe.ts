import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metric',
})
export class MetricPipe implements PipeTransform {
  transform(value: number, unit: string): number {
    // TODO: Add more conversions
    switch (unit) {
      default:
        return value;
      case 'coeff-to-percentage':
        return Math.ceil(value * 100);
      case 'miles-to-kilometers':
        return +Math.ceil(value / 0.62137).toFixed(2);
      case 'kilometers-to-miles':
        return +Math.ceil(value * 0.62137).toFixed(2);
      case 'meters_second-to-kilometers_hour':
        return +Math.ceil(value * 3.6).toFixed(2);
      case 'meters_second-to-miles_hour':
        return +Math.ceil(value * 3.6 * 0.62137).toFixed(2);
      case 'meters_to_feet':
        return +(value * 3.28).toFixed(2);
      case 'cels_to_fahr':
        return +(value * 32).toFixed(2);
    }
  }
}
