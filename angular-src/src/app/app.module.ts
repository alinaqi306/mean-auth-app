import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';

import { FlashMessagesModule} from 'angular2-flash-messages';

import { ValidationService } from './services/validation.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { GraphComponent } from './components/graph/graph.component';
import { CsvgraphComponent } from './components/csvgraph/csvgraph.component';

const appRoutes : Routes = [
  {path : '', component : HomeComponent},
  {path : 'login', component : LoginComponent},
  {path : 'register', component : RegisterComponent},
  {path : 'dashboard', component : DashboardComponent, canActivate:[AuthGuard]},
  {path : 'profile', component : ProfileComponent, canActivate:[AuthGuard]},
  {path : 'graph', component : GraphComponent},
  {path : 'csvgraph', component : CsvgraphComponent}

];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    GraphComponent,
    CsvgraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  providers: [ValidationService, AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
