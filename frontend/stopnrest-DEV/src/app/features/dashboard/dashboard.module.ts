import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from './search/search.component'; // Update the path as necessary
import { PlaceCardsComponent } from './place-cards/place-cards.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { PipesModule } from '../../shared/pipes/pipes.module'
import { ReactiveFormsModule } from '@angular/forms';
import { BookingDialogComponent } from './booking/booking-dialog/booking-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    DashboardComponent,
    SearchComponent,
    PlaceCardsComponent,
    FooterComponent,
    SearchResultComponent,
    BookingDialogComponent  // Add the ExploreIndiaComponent here
  ],
  imports: [
    CommonModule,MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule,
    DashboardRoutingModule,
    MatCardModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
  ]
})
export class DashboardModule { }
