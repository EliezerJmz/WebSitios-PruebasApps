import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioAtsComponent } from './formulario-ats.component';
import { ViewParkingComponent } from './view-parking/view-parking.component';
import { AuthGuard } from '../../guards/auth.guard';


const routes: Routes = [
        { path: '',component: FormularioAtsComponent},
        { path: '',component: ViewParkingComponent},
        { path: 'create-parking',
            loadChildren: () => import('../create-parking/create-parking.module').then(m => m.CreateParkingModule),
            canActivate: [AuthGuard]
        },
        { path: 'view-parking',
            loadChildren: () => import('./view-parking/view-parking.module').then(m=> m.ViewParkingModule),
            canActivate: [AuthGuard]
        },
        { path: 'edit-parking',
            loadChildren: () => import('../edit-parking/emptydemo.module').then(m => m.EmptyDemoModule),
            canActivate: [AuthGuard]
        },
  
];


@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FormularioAtsRoutingModule { }
