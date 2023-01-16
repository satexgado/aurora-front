import { Component, OnInit } from '@angular/core';
import { Helper } from 'src/app/helpers/helper/helper';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss'],
})
export class ConfigurationsComponent implements OnInit {
  constructor(public helper: Helper) {}

  ngOnInit(): void {}
}
