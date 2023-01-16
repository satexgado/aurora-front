import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-courrier-propriete-ui',
  templateUrl: 'propriete-ui.component.html',
})

export class CourrierUiProprieteComponent implements OnInit {
    fragment: string;

    constructor(
        public route: ActivatedRoute,
    ) { }
    
    ngOnInit(): void {
        const detailsView = 'type,etape,nature,statut,urgence';
        this.route.fragment.subscribe(fragment => {
        this.fragment = fragment;
        if(!detailsView.includes(fragment)) {
            this.fragment = 'type';
        }
        })
    }
}