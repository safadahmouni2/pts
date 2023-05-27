import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sprintsFilter',
    pure: false
})
export class SprintsFilterPipe implements PipeTransform {
    transform(items: any[], sprintCriteria: any[]): any {
        if (!items) {
            return [];
        }
        if (!sprintCriteria) {
            return items;
        }
        let result = items;
        if (sprintCriteria[0] && sprintCriteria[0].length > 0) {
            result = result.filter(item => sprintCriteria[0].some(f => f.id === item.stateId));
        }
        if (sprintCriteria[1]) {
            result = result.filter(x => x.project === sprintCriteria[1]);
        }
        if (sprintCriteria[2] && sprintCriteria[2].length > 0) {
            result = result.filter(item => sprintCriteria[2].some(f => f.id === item.id));
         
        }
        return result;
    }
}
