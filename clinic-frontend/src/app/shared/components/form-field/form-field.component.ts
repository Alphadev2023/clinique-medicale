import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { LucideAngularModule, AlertCircle, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent {
  readonly AlertCircle = AlertCircle;
  readonly CheckCircle = CheckCircle;

  @Input() label: string = '';
  @Input() control!: AbstractControl | null;
  @Input() required: boolean = false;
  @Input() hint: string = '';

  get isInvalid(): boolean {
    return !!(this.control?.invalid && this.control?.touched);
  }

  get isValid(): boolean {
    return !!(this.control?.valid && this.control?.touched);
  }

  get errorMessage(): string {
    if (!this.control?.errors) return '';
    const errors = this.control.errors;

    if (errors['required']) return 'Ce champ est obligatoire';
    if (errors['email']) return 'Adresse email invalide';
    if (errors['minlength'])
      return `Minimum ${errors['minlength'].requiredLength} caractères`;
    if (errors['maxlength'])
      return `Maximum ${errors['maxlength'].requiredLength} caractères`;
    if (errors['min']) return `Valeur minimum : ${errors['min'].min}`;
    if (errors['max']) return `Valeur maximum : ${errors['max'].max}`;
    if (errors['pattern']) return 'Format invalide';
    if (errors['mismatch']) return 'Les mots de passe ne correspondent pas';
    if (errors['emailTaken']) return 'Cet email est déjà utilisé';

    return 'Valeur invalide';
  }
}
