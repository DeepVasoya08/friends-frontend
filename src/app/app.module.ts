import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { TimeagoModule } from 'ngx-timeago';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home/home.component';
import { MaterialModule } from './shared/material.module';
import { SidebarComponent } from './components/home/sidebar/sidebar.component';
import { FeedComponent } from './components/home/feed/feed.component';
import { HeaderComponent } from './components/home/header/header.component';
import { RightbarComponent } from './components/home/rightbar/rightbar.component';

import { Reducer } from './store/reducer';
import { ProfileComponent } from './components/home/profile/profile.component';
import { StoryComponent } from './components/home/story/story.component';
import { CommentsComponent } from './components/home/feed/comments/comments.component';
import { VisitComponent } from './components/home/visit/visit.component';
import { RequestsComponent } from './components/home/header/requests/requests.component';
import { UsersComponent } from './components/home/users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    SidebarComponent,
    FeedComponent,
    HeaderComponent,
    RightbarComponent,
    ProfileComponent,
    StoryComponent,
    CommentsComponent,
    VisitComponent,
    RequestsComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TimeagoModule.forRoot(),
    StoreModule.forRoot({ store_state: Reducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
