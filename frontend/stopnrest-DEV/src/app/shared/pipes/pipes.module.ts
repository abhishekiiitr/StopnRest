import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from './format-date.pipe';
import { AverageRatingPipe } from './avarage-rating.pipe';



@NgModule({
  declarations: [
    FormatDatePipe,
    AverageRatingPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AverageRatingPipe,
    // other pipes
  ]
})
export class PipesModule { }
