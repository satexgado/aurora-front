import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
    declarations:[
        LoginComponent,
        LogoutComponent
    ],
    imports:[
        CommonModule,
        SharedModule
    ],
    exports: [
        LoginComponent,
        LogoutComponent
    ]
})
export class AuthModule{
    
}