import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ApolloModule } from 'apollo-angular';
import { GridModule } from '@progress/kendo-angular-grid';

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
import { MatGridListModule } from '@angular/material/grid-list';
import { HighchartsChartModule } from 'highcharts-angular';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentationComponent } from './documentation/documentation.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from 'src/store/reducers/reducers';
import { TicketEffects } from 'src/store/effects/ticket.effects';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { CommentEffects } from 'src/store/effects/comment.effects';
import { CommentComponent } from './comment/comment.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DocumentationEffects } from 'src/store/effects/documentation.effects';
import { DiscussionEffects } from 'src/store/effects/discussion.effects';
import { UserEffects } from 'src/store/effects/user.effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { ProjectEffects } from 'src/store/effects/project.effects';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { TicketSearchComponent } from './ticket-search/ticket-search.component';
import { AutoResizeDirective } from './ticket-details/auto-resize.directive';
import { StatisticsEffects } from 'src/store/effects/statistics.effects';
import { UsersComponent } from './users/users.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    StatisticComponent,
    LoginComponent,
    RegisterComponent,
    DocumentationComponent,
    CommentComponent,
    TicketDetailsComponent,
    ProjectDetailsComponent,
    TicketSearchComponent,
    AutoResizeDirective,
    UsersComponent
  ],
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([
      TicketEffects,
      CommentEffects,
      DocumentationEffects,
      DiscussionEffects,
      UserEffects,
      ProjectEffects,
      StatisticsEffects
    ]),
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatGridListModule,
    MatDialogModule,
    HighchartsChartModule,
    FormsModule,
    ReactiveFormsModule,
    ApolloModule,
    GraphQLModule,
    HttpClientModule,
    GridModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
