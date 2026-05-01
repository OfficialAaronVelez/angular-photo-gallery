import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

/** Contraseñas iguales (validador de grupo). */
export const passwordMatchValidator: ValidatorFn = (g: AbstractControl) => {
  const p = g.get('password')?.value as string | undefined;
  const c = g.get('confirmar')?.value as string | undefined;
  if (!p && !c) return null;
  return p === c ? null : { passwordMismatch: true };
};

/** Edad mínima en años. */
export function minAgeValidator(min: number): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const raw = ctrl.value;
    if (raw === '' || raw == null) return null;
    const n = Number(raw);
    if (Number.isNaN(n)) return { notANumber: true };
    return n < min ? { minAge: { required: min, actual: n } } : null;
  };
}

/** Teléfono opcional: si hay texto, formato simple. */
export const optionalPhoneValidator: ValidatorFn = (ctrl: AbstractControl) => {
  const v = String(ctrl.value ?? '').trim();
  if (!v) return null;
  return /^[\d\s\-+]{7,20}$/.test(v) ? null : { phoneInvalid: true };
};

const EMAILS_OCUPADOS = new Set([
  'admin@bancodigital.com',
  'cliente@bancodigital.com',
  'existente@email.com',
]);

/** Simula API: correo ya registrado. */
export function emailRegistradoAsync(): AsyncValidatorFn {
  return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
    const v = String(ctrl.value ?? '')
      .trim()
      .toLowerCase();
    if (!v) return of(null);
    return timer(600).pipe(
      map(() => (EMAILS_OCUPADOS.has(v) ? { emailTaken: true } : null))
    );
  };
}
