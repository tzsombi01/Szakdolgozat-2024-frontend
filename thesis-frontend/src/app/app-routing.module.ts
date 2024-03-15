import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAccessPageComponent } from './no-access-page/no-access-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    children: [],
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'access-denied',
    component: NoAccessPageComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
