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
import {CalendarModule, DialogModule} from 'primeng/primeng';

import { ValidationService } from './services/validation.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { GraphComponent } from './components/graph/graph.component';
import { CsvgraphComponent } from './components/csvgraph/csvgraph.component';
import { RestbasedgraphComponent } from './components/restbasedgraph/restbasedgraph.component';
import { GraphdataService } from './services/graphdata.service';
import { MultilinegraphComponent } from './components/multilinegraph/multilinegraph.component';
import { ZoomgraphComponent } from './components/zoomgraph/zoomgraph.component';
//import { DonutComponent } from './components/donut/donut.component';
import { PiedonutComponent } from './components/piedonut/piedonut.component';

const appRoutes : Routes = [
  {path : '', component : HomeComponent},
  {path : 'login', component : LoginComponent},
  {path : 'register', component : RegisterComponent},
  {path : 'dashboard', component : DashboardComponent, canActivate:[AuthGuard]},
  {path : 'profile', component : ProfileComponent, canActivate:[AuthGuard]},
  {path : 'graph', component : GraphComponent},
  {path : 'csvgraph', component : CsvgraphComponent},
  {path : 'restbasedgraph', component : RestbasedgraphComponent},
  {path : 'multilinegraph', component : MultilinegraphComponent},
  {path : 'zoomgraph', component : ZoomgraphComponent},
  {path : 'piedonut', component : PiedonutComponent}

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
    CsvgraphComponent,
    RestbasedgraphComponent,
    MultilinegraphComponent,
    ZoomgraphComponent,
    //DonutComponent,
    PiedonutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    CalendarModule,
    DialogModule
  ],
  providers: [ValidationService, AuthService,AuthGuard,GraphdataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
