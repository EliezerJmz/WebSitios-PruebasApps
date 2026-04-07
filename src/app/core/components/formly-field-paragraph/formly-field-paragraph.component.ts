import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-paragraph',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-field">
      <p *ngIf="resolvedLabel" style="display:block; font-weight:500; font-size:1.1rem; margin-bottom:0.5rem; white-space:pre-line; margin-top:0;">{{ resolvedLabel }}</p>
      <p *ngIf="shouldShowText" class="m-0" [style.white-space]="'pre-line'">{{ resolvedText }}</p>
    </div>
  `,
})
export class FormlyFieldParagraph extends FieldType<FieldTypeConfig> {
  get resolvedLabel(): string {
    return String(
      this.props.label ||
      this.to?.label ||
      this.field?.templateOptions?.label ||
      (this.field as any)?.label ||
      ''
    ).trim();
  }

  get resolvedText(): string {
    return String(
      this.props['text'] ||
      this.to?.description ||
      this.field?.templateOptions?.description ||
      ''
    );
  }

  get shouldShowText(): boolean {
    return this.normalize(this.resolvedText) !== this.normalize(this.resolvedLabel);
  }

  private normalize(value: string): string {
    return (value || '').replace(/\s+/g, ' ').trim();
  }
}
