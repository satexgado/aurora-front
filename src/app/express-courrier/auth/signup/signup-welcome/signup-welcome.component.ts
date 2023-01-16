import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-signup-welcome',
  templateUrl: './signup-welcome.component.html',
  styleUrls: ['./signup-welcome.component.scss'],
})
export class SignupWelcomeComponent implements OnInit {
  @Output() suivant = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
