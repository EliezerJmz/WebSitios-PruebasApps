import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-multicheckbox',
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
