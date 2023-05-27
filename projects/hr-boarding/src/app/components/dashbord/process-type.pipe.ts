import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { ProcessModel } from '../../models/process.model';

@Pipe({
  name: 'processType'
})

@Injectable()
export class ProcessTypePipe implements PipeTransform {
  transform(processList: ProcessModel[], criteria: { processTypeId: number, departementValue: string, searchString: string }): any[] {
    if (!processList) {
      return [];
    }
    if (!criteria || (!criteria.processTypeId && !criteria.searchString && !criteria.departementValue)) {
      return processList;
    }
    if (!criteria.searchString && !criteria.departementValue) {
      return processList.filter(process => process.process_type_id === criteria.processTypeId);
    }
    if (!criteria.processTypeId && !criteria.departementValue) {
      return processList.filter(process => process.USER.toLowerCase().includes(criteria.searchString.toLowerCase()));
    }
    if (!criteria.searchString && !criteria.processTypeId) {
      return processList.filter(process => process.department === criteria.departementValue);
    }
    if (!criteria.searchString) {
      return processList.filter(process => process.process_type_id === criteria.processTypeId && process.department === criteria.departementValue);
    }
    if (!criteria.departementValue) {
      return processList.filter(process => process.process_type_id === criteria.processTypeId && process.USER.toLowerCase().includes(criteria.searchString.toLowerCase()));
    }
    if (!criteria.processTypeId) {
      return processList.filter(process => process.department === criteria.departementValue && process.USER.toLowerCase().includes(criteria.searchString.toLowerCase()));
    }
    return processList.filter(process => process.process_type_id === criteria.processTypeId && process.department === criteria.departementValue && process.USER.toLowerCase().includes(criteria.searchString.toLowerCase()));

  }
}
