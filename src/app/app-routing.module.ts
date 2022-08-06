import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurd } from './auth/auth.guard';
import { FormComponent } from './auth/form/form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';

const routes: Routes = [
  {path: "", component: FormComponent},
  {path: "home", component: HomePageComponent, canActivate: [AuthGaurd]},
  {path: "profile", component: ProfilePageComponent, canActivate: [AuthGaurd]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGaurd]
})
export class AppRoutingModule { }
