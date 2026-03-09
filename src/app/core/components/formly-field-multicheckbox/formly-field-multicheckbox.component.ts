import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-multicheckbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-field">
      <label *ngIf="props.label">{{ props.label }}</label>
      <div class="p-field-checkbox" *ngFor="let option of props.options | formlySelectOptions: field | async">
        <p-checkbox
          [name]="fieldKey"
          [inputId]="fieldKey + '_' + option.value"
          [value]="option.value"
          [label]="option.label"
          [disabled]="option.disabled || false"
          [ngModel]="isChecked(option.value)"
          (ngModelChange)="onChange(option.value, $event)"
          [binary]="true">
        </p-checkbox>
      </div>
      <small *ngIf="props.description" class="p-text-secondary">{{ props.description }}</small>
    </div>
  `
})
export class FormlyFieldMultiCheckbox extends FieldType<FieldTypeConfig> {
  
  get fieldKey(): string {
    return String(this.field.key || '');
  }

  override defaultOptions = {
    defaultValue: [],
  };

  onChange(value: any, checked: boolean) {
    const currentValue = this.formControl.value || [];
    
    if (checked) {
      // Agregar valor si no existe
      if (!currentValue.includes(value)) {
        this.formControl.setValue([...currentValue, value]);
      }
    } else {
      // Remover valor
      this.formControl.setValue(currentValue.filter((v: any) => v !== value));
    }
  }

  isChecked(value: any): boolean {
    const currentValue = this.formControl.value || [];
    return currentValue.includes(value);
  }
}
