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
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentationComponent } from './documentation/documentation.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from 'src/store/reducers/reducers';
import { TicketEffects } from 'src/store/effects/ticket.effects';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { CommentEffects } from 'src/store/effects/comment.effects';
import { CommentComponent } from './comment/comment.component';

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
    CommentComponent
  ],
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([
      TicketEffects,
      CommentEffects
    ]),
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatGridListModule,
    HighchartsChartModule,
    ReactiveFormsModule,
    ApolloModule,
    GraphQLModule,
    HttpClientModule,
    GridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
