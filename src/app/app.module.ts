import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './auth/form/form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent, PickPostModalComponent } from './header/header.component';
import { AddCommentDialogComponent, HomePageComponent } from './home-page/home-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { AddProfileComponent } from './profile-page/add-profile/add-profile.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { EditPostModalComponent, LikeDetailsComponent, PostDetailsComponent } from './posts/post-details/post-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFileValidatorLibModule } from 'angular-file-validator';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    HeaderComponent,
    HomePageComponent,
    ProfilePageComponent,
    AddProfileComponent,
    PostListComponent,
    PickPostModalComponent,
    PostDetailsComponent,
    LikeDetailsComponent,
    EditPostModalComponent,
    AddCommentDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDividerModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgFileValidatorLibModule
  ],
  providers: [
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
