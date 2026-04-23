import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'formly-field-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CalendarModule, FormlyModule],
  template: `
    <div class="p-field">
      <label *ngIf="props.label">{{ props.label }}</label>
      <p-calendar
        [formControl]="formControl"
        [formlyAttributes]="field"
        [showIcon]="true"
        [readonlyInput]="!!props['disabled']"
        [dateFormat]="to['dateFormat'] || 'yy-mm-dd'">
      </p-calendar>
    </div>
  `,
})
export class FormlyCalendarType extends FieldType<FieldTypeConfig> implements OnInit {
  ngOnInit() {
    if (this.props['disabled']) {
      this.formControl.disable();
    }
  }
}
