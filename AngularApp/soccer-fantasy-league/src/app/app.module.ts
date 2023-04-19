import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {MatCardModule} from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, MatNativeDateModule, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { ServicesModule } from './services/services.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SquadSelectionComponent } from './squad-selection/squad-selection.component';
import { MatTableModule } from '@angular/material/table';
import { RemovePlayerDialogComponent } from './remove-player-dialog/remove-player-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PlayerSelectionListComponent } from './player-selection-list/player-selection-list.component';
import { DefaultDisplayPlayerDataPipePipe } from './pipes/default-display-player-data-pipe.pipe';
import { NewUserComponent } from './new-user/new-user.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'signup', component: NewUserComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SquadSelectionComponent,
    RemovePlayerDialogComponent,
    PlayerSelectionListComponent,
    DefaultDisplayPlayerDataPipePipe,
    NewUserComponent
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    RouterModule.forRoot(routes),
    ServicesModule,
    MatDialogModule,
    NoopAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
