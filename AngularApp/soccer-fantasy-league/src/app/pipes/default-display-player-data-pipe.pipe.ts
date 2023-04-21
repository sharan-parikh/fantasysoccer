import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultDisplayPlayerDataPipe'
})
export class DefaultDisplayPlayerDataPipePipe implements PipeTransform {

  transform(value: number): string {
    return (value === 0) ? "" : `${value ? value : ''}`;
  }

}
