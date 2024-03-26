import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAccessPageComponent } from './no-access-page/no-access-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { StatisticComponent } from './statistic/statistic.component';
import { TicketComponent } from './ticket/ticket.component';
import { ProjectsComponent } from './projects/projects.component';

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
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'discussions',
    component: DiscussionComponent,
  },
  {
    path: 'statistics',
    component: StatisticComponent,
  },
  {
    path: 'tickets',
    component: TicketComponent,
  },
  {
    path: 'projects',
    component: ProjectsComponent,
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
