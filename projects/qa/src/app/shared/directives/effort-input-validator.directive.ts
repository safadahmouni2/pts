import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appEffortInputValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EffortInputValidatorDirective,
      multi: true
    }
  ]
})
export class EffortInputValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    const isValid = this.validateEffortInput(control.value);
    return isValid ? null : { 'effortInputValidator': { value: control.value } };
  }

  validateEffortInput(input: string): boolean {

    // Check if input is empty
    if (!input) {
      return false;
    }

    // Check if input contains only numbers and colons
    if (!/^[0-9:]+$/.test(input)) {
      return false;
    }

    // Check if input has the correct format (hh:mm:ss)
    const timeParts = input.split(':');
    if (timeParts.length !== 3) {
      return false;
    }
    const [hours, minutes, seconds] = timeParts;
    if (isNaN(Number(hours)) || isNaN(Number(minutes)) || isNaN(Number(seconds))) {
      return false;
    }
    if (Number(hours) < 0 || Number(hours) > 99 || Number(minutes) < 0 || Number(minutes) > 59 || Number(seconds) < 0 || Number(seconds) > 59) {
      return false;
    }

    return true;
  }
}
