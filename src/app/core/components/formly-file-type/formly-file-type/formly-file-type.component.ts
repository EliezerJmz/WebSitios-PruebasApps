import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-file',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUploadModule, FormlyModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-field">
      <label *ngIf="props.label">{{ props.label }}</label>
      <p-fileUpload
        [name]="fieldKey"
        [accept]="props['accept']"
        [maxFileSize]="props['maxFileSize']"
        [multiple]="props['multiple']"
        (onSelect)="onFileSelect($event)"
        [auto]="true"
        [chooseLabel]="props['chooseLabel'] || 'Seleccionar'"
        [showUploadButton]="false"
        [showCancelButton]="true">
      </p-fileUpload>
      <small *ngIf="props.description" class="p-text-secondary">{{ props.description }}</small>
    </div>
  `
})
export class FormlyFieldFile extends FieldType<FieldTypeConfig> {
  get fieldKey(): string {
    return String(this.field.key || '');
  }

  override defaultOptions = {
    defaultValue: null,
  };

  onFileSelect(event: any) {
    const files = event.files || event.currentFiles;
    if (files && files.length > 0) {
      if (this.props['multiple']) {
        this.formControl.setValue(files);
      } else {
        this.formControl.setValue(files[0]);
      }
      this.formControl.markAsTouched();
    }
  }
}
