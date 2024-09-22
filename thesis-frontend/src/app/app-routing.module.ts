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
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DocumentationComponent } from './documentation/documentation.component';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { TicketSearchComponent } from './ticket-search/ticket-search.component';
import { UsersComponent } from './users/users.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    children: [],
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:id',
    component: ProjectDetailsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: TicketSearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tickets/:ticketId',
        component: TicketDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'statistics',
        component: StatisticComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'discussions',
        component: DiscussionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'discussions/:discussionId',
        component: DiscussionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'documentations',
        component: DocumentationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'documentations/:documentationId',
        component: DocumentationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
      },
    ]
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
