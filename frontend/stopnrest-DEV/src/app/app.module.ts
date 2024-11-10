import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Ensure Angular Material animations are enabled
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';  // Routing for the app
import { AppComponent } from './app.component';  // Root component

// Core and Shared modules to encapsulate services, utilities, and common components
import { CoreModule } from './core.module';
import { SharedModule } from './shared.module';

// Feature modules for lazy loading and feature-specific components
import { DashboardModule } from './features/dashboard/dashboard.module';

// Layout modules for reusability of the navbar and sidebar
import { NavbarModule } from './core/layout/navbar/navbar.module';
import { SidebarModule } from './shared/component/sidebar/sidebar.module';

// Angular Material modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BookingsModule } from './features/bookings/bookings.module';
import { WishlistModule } from './features/wishlist/wishlist.module';
import { ProfileModule } from './features/profile/profile.module';
import { MyPropertiesModule } from './features/my-properties/my-properties.module';  // Sidenav for navigation
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent  // Root component declaration
  ],
  imports: [
    BrowserModule,  // Needed for app initialization in the browser
    BrowserAnimationsModule,  // Required for Material animations
    AppRoutingModule,  // Application routing
    CoreModule,  // Core services like Auth, Guards, etc.
    SharedModule,  // Shared components, directives, pipes
    DashboardModule,  // Dashboard feature module
    NavbarModule,  // Navbar component module
    SidebarModule,  // Sidebar component module
    ReactiveFormsModule,  // Reactive forms module
    HttpClientModule,  // HTTP client module
    // Material module imports (can add more as needed)
    MatSidenavModule,
    BookingsModule, 
    WishlistModule, 
    ProfileModule, 
    MyPropertiesModule,  // Sidenav for the sidebar
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ToastrModule.forRoot({
      timeOut: 3000,  // Toast duration in milliseconds
      positionClass: 'toast-top-right', // Change position as needed
      preventDuplicates: true, // Prevent duplicate toasts
    }),
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    }
  ],
  bootstrap: [AppComponent]  // Bootstrap the root component
})
export class AppModule { }
