import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: number | Date): string {
    let duration: number;
    if (value instanceof Date) {
      duration = (Date.now() - value.getTime()) / 1000;
      if (duration < 0) {
        return '0s';
      }
    } else {
      duration = value;
    }
    if (duration < 60) {
      return `${value}s`;
    }
    if (duration < 3600) {
      return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    }
    if (duration < 86400) {
      return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
    }
    return `${Math.floor(duration / 86400)}d`;
  }
}
