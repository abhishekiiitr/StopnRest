import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';

import { ProfileComponent } from './profile.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@NgModule({

  declarations: [

    ProfileComponent,

  ],

  imports: [

    CommonModule,

    ProfileRoutingModule,

    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    FormsModule

  ]

})

export class ProfileModule { }

