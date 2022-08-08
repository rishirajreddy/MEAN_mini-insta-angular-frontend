import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './auth/form/form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { FooterComponent } from './footer/footer.component';
import { AngularMaterialModule } from './angular-material.module';
import { OtherProfileComponent } from './home-page/other-profile/other-profile.component';

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
    AddCommentDialogComponent,
    FooterComponent,
    OtherProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
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
