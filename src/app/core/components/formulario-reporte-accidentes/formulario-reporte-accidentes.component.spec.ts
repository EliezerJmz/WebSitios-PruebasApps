import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioReporteAccidentesComponent } from './formulario-reporte-accidentes.component';

describe('FormularioReporteAccidentesComponent', () => {
  let component: FormularioReporteAccidentesComponent;
  let fixture: ComponentFixture<FormularioReporteAccidentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioReporteAccidentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioReporteAccidentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
