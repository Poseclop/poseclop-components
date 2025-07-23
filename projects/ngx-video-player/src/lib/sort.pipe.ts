import { Pipe, PipeTransform } from '@angular/core';

interface sortable { time: number }

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform<T extends sortable[]>(values: T): T {
    return values.sort((a, b) => a.time - b.time);
  }
}
