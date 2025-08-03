import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfLengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const digitsOnly = control.value.replace(/\D/g, '');
    return digitsOnly.length !== 11 ? { invalidCpfLength: true } : null;
  };
}
