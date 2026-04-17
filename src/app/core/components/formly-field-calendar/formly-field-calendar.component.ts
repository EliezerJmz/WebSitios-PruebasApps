import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-calendar',
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
