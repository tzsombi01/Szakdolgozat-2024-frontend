import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoAccessPageComponent } from './no-access-page/no-access-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProfileComponent } from './profile/profile.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProjectsComponent } from './projects/projects.component';
import { TicketComponent } from './ticket/ticket.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { StatisticComponent } from './statistic/statistic.component';

@NgModule({
  declarations: [
    AppComponent,
    NoAccessPageComponent,
    PageNotFoundComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    ProfileComponent,
    SidebarComponent,
    ProjectsComponent,
    TicketComponent,
    DiscussionComponent,
    StatisticComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
