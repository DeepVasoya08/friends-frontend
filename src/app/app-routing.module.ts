import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { RequestsComponent } from './components/home/header/requests/requests.component';
import { HomeComponent } from './components/home/home/home.component';
import { ProfileComponent } from './components/home/profile/profile.component';
import { VisitComponent } from './components/home/visit/visit.component';
import { RoutingGuard } from './guards/routing.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'visit/:id',
    component: VisitComponent,
    canActivate: [RoutingGuard],
  },
  {
    path: 'friends',
    component: RequestsComponent,
    canActivate: [RoutingGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
