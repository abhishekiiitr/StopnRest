import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { MyPropertiesRoutingModule } from './my-properties-routing.module';
import { MyPropertiesComponent } from './my-properties.component';
import { CreateNewComponent } from './create-new/create-new.component';
import { ViewPropertyComponent } from './view-property/view-property.component';


@NgModule({
  declarations: [
    MyPropertiesComponent,
    CreateNewComponent,
    ViewPropertyComponent
  ],
  imports: [
    CommonModule,
    MyPropertiesRoutingModule,
    FormsModule
  ]
})
export class MyPropertiesModule { }
