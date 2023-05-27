import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myfilter',
  pure: false
})
export class FilterComponent implements PipeTransform {

  constructor() { }


  transform(items: any[], args: any[]): any {
    if (!items) { return null; }
    if (!args[0]) { return items; }
    let filterdData;
    switch (args[1]) {
      case 'responsable':
        if (args[0] !== '') {
          filterdData = items.filter(res => {
            return res.creator === args[0];
          });
        } else {
          filterdData = items;
        }
        break;
      case 'moderator':
        if (args[0] !== '') {
          filterdData = items.filter(res => {
            if (res.moderator) {
              return res.moderator.code === args[0];
            }
          });
        } else {
          filterdData = items;
        }
        break;
      case 'type':
        if (args[0] !== '') {
          filterdData = items.filter(res => {
            return res.name === args[0];
          });
        } else {
          filterdData = items;
        }
        break;
      case 'urgency':
        if (args[0] !== '') {
          filterdData = items.filter(res => {
            return res.urgency === args[0];
          });
        } else {
          filterdData = items;
        }
        break;
      case 'decision':
        if (args[0] !== '') {
          filterdData = items.filter(res => {
            return res.status === args[0];
          });
        } else {
          filterdData = items;
        }

        break;
    }
    return filterdData;
  }
}

