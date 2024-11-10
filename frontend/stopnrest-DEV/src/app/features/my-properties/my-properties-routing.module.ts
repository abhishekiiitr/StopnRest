import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{ MyPropertiesComponent} from './my-properties.component'
import{CreateNewComponent} from './create-new/create-new.component'
import{ ViewPropertyComponent } from './view-property/view-property.component'
const routes: Routes = [
  { path: '', component: MyPropertiesComponent },
  { path: 'create-new', component: CreateNewComponent },
  {path:'view-property', component:ViewPropertyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyPropertiesRoutingModule { }
