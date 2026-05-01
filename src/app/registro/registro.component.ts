import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  emailRegistradoAsync,
  minAgeValidator,
  optionalPhoneValidator,
  passwordMatchValidator,
} from './registro-validators';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);

  readonly minEdad = 18;
  submitting = false;
  envioExitoso = false;

  form = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [emailRegistradoAsync()],
        updateOn: 'blur',
      }),
      password: [
        '',
        [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)],
      ],
      confirmar: ['', Validators.required],
      edad: this.fb.control<number | null>(null, {
        validators: [Validators.required, Validators.min(1), Validators.max(120), minAgeValidator(this.minEdad)],
      }),
      terminos: [false, Validators.requiredTrue],
      telefonos: this.fb.array([this.telefonoCtrl()]),
    },
    { validators: passwordMatchValidator }
  );

  interacted(c: AbstractControl): boolean {
    return c.touched || c.dirty;
  }

  passwordMismatchVisible(): boolean {
    const p = this.form.controls.password;
    const c = this.form.controls.confirmar;
    return this.interacted(p) || this.interacted(c) ? this.form.hasError('passwordMismatch') : false;
  }

  get telefonos(): FormArray {
    return this.form.get('telefonos') as FormArray;
  }

  private telefonoCtrl() {
    return this.fb.nonNullable.control('', { validators: [optionalPhoneValidator] });
  }

  agregarTelefono(): void {
    this.telefonos.push(this.telefonoCtrl());
  }

  quitarTelefono(i: number): void {
    if (this.telefonos.length > 1) this.telefonos.removeAt(i);
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.form.pending) return;

    this.submitting = true;
    window.setTimeout(() => {
      this.submitting = false;
      this.form.reset({ nombre: '', email: '', password: '', confirmar: '', edad: null, terminos: false });
      this.telefonos.clear();
      this.telefonos.push(this.telefonoCtrl());
      this.envioExitoso = true;
      window.setTimeout(() => (this.envioExitoso = false), 2800);
    }, 1500);
  }
}
