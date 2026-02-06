import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormularioAtsComponent } from './formulario-ats.component';
import { ViewParkingComponent } from './view-parking/view-parking.component';
import { AuthGuard } from '../../guards/auth.guard';



@NgModule({
	imports: [RouterModule.forChild([
		{ path: '',component: FormularioAtsComponent},
        {path: '',component: ViewParkingComponent},

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



	])],
	exports: [RouterModule]
})
export class FormularioAtsRoutingModule { }
