import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulariosEnviadosComponent } from './formularios-enviados.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: FormulariosEnviadosComponent }
    ])],
    exports: [RouterModule]
})
export class FormulariosEnviadosRoutingModule { }
