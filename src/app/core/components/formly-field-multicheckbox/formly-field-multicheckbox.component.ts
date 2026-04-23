import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FormlySelectModule } from '@ngx-formly/core/select';

@Component({
  selector: 'formly-field-multicheckbox',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxModule, FormlyModule, FormlySelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './formly-field-multicheckbox.component.html',
  styleUrls: ['./formly-field-multicheckbox.component.scss']
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
