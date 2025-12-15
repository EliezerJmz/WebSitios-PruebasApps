import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSentsComponent } from './form-sents.component';

describe('FormSentsComponent', () => {
  let component: FormSentsComponent;
  let fixture: ComponentFixture<FormSentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormSentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
