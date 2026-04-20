import { Component, OnInit } from '@angular/core';
import { OverviewService } from '../../service/dashboar/overview.service';
import { OverView } from '../../api/dashboard/overView.model';

@Component({
    selector: 'app-formularios-enviados',
    templateUrl: './formularios-enviados.component.html',
    styleUrls: ['./formularios-enviados.component.scss']
})
export class FormulariosEnviadosComponent implements OnInit {

constructor(private overviewService: OverviewService) {}

ngOnInit() {}
    
}
