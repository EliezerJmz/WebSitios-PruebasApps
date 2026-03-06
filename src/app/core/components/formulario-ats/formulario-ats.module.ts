import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormularioAtsRoutingModule } from './formulario-ats-routing.module';
import { FormularioAtsComponent } from './formulario-ats.component';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageModule } from 'primeng/image';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { SpinnerModule } from 'primeng/spinner';
import { CardModule } from 'primeng/card';
import { GeolocationComponent } from './geolocation/geolocation/geolocation.component';
import { A11yModule } from "@angular/cdk/a11y";
import { CalendarModule } from 'primeng/calendar';
//Formly
import { FormlyModule } from '@ngx-formly/core';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';  
import { FormlySelectModule } from '@ngx-formly/core/select';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
    CommonModule,
    FormularioAtsRoutingModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    ButtonModule, SplitButtonModule,
    ToggleButtonModule,
    MenuModule,
    TagModule,
    AccordionModule,
    CheckboxModule,
    ImageModule,
    ToastModule,
    ButtonModule,
    SpinnerModule,
    CardModule,
    CalendarModule,
    //my components
    UploadPhotoComponent,
    A11yModule,
    //Formly
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyPrimeNGModule,
    FormlySelectModule

    
],
    declarations: [FormularioAtsComponent, GeolocationComponent]
})
export class FormularioAtsModule { }
