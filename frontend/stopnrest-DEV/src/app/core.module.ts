import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarModule } from './core/layout/navbar/navbar.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NavbarModule,
    HttpClientModule
  ]
})
export class CoreModule { }
