import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyFileTypeComponent } from './formly-file-type.component';

describe('FormlyFileTypeComponent', () => {
  let component: FormlyFileTypeComponent;
  let fixture: ComponentFixture<FormlyFileTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormlyFileTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormlyFileTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
