import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from './shared/component/sidebar/sidebar.module';
import { PipesModule } from './shared/pipes/pipes.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SidebarModule,
    PipesModule
  ]
})
export class SharedModule { }
