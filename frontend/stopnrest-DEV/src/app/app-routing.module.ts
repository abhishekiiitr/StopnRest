import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'bookings', loadChildren: () => import('./features/bookings/bookings.module').then(m => m.BookingsModule),canActivate: [authGuard]  },
  { path: 'wishlist', loadChildren: () => import('./features/wishlist/wishlist.module').then(m => m.WishlistModule),canActivate: [authGuard]  },
  { path: 'profile', loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),canActivate: [authGuard]  },
  {path: 'auth', loadChildren: ()=> import('./auth/auth.module').then(m=>m.AuthModule)},
  {path:'', redirectTo: 'dashboard',pathMatch:'full'},
  {path: 'my-properties', loadChildren:() => import('./features/my-properties/my-properties.module').then(m => m.MyPropertiesModule),canActivate: [authGuard] }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
