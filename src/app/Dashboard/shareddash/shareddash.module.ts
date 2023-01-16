import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoardingComponent } from './loarding/loarding.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoDataComponent } from './no-data/no-data.component';
import { MargePipe } from './marge.pipe';



@NgModule({
  declarations: [
    LoardingComponent,
    NoDataComponent,
    MargePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports:[
    LoardingComponent,
    NoDataComponent,
    MargePipe
  ]
})
export class ShareddashModule { }
