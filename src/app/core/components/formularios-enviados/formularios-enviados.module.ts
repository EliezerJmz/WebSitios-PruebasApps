import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormulariosEnviadosComponent } from './formularios-enviados.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { FormulariosEnviadosRoutingModule } from './formularios-enviados-routing.module';
import { LineBarComponent } from './line-bar/line-bar.component';
import { VerticalBarComponent } from './vertical-bar/vertical-bar.component';
import { TablePaginatorComponent } from './table-paginator/table-paginator.component';
import { AccordionModule } from "primeng/accordion";
import { CheckboxModule } from "primeng/checkbox";
import { TagModule } from 'primeng/tag';
import { FormSentsComponent } from './form-sents/form-sents.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Toast, ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
    FormulariosEnviadosRoutingModule,
    AccordionModule,
    CheckboxModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    TooltipModule
],
    declarations: [
        FormulariosEnviadosComponent,
        LineBarComponent,
        VerticalBarComponent,
        TablePaginatorComponent,
        FormSentsComponent,

    ]
})
export class FormulariosEnviadosModule { }
