import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostService } from '../posts/posts.service';
import { AddProfileComponent } from './add-profile/add-profile.component';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  profileAvailable = false;
  isLoading = false;
  profileAddNotifier:Subscription = this.profileService.addProfileListener.subscribe({
    next: (notified) => {
      this.getUserPosts();
      console.log("Now loading profile...");
      this.loadProfile();
    }
  })
  profile = {
    name : "",
    email:"",
    username:"",
    bio:"",
    dp:"",
    posts:0
  }

  posts = [];

  constructor(private profileService:ProfileService,
              private route:ActivatedRoute, 
              private dialog:MatDialog,
              private postService:PostService
              ) { }

  ngOnInit() {
    this.getUserPosts();
    this.loadProfile();
    }

  getUserPosts(){
    return this.postService.getMyPosts()
    .subscribe({
      next: (v:any) => {
        this.posts = v;
        // console.log(this.posts);
      }
    }) 
  }

  loadProfile(){
    this.isLoading = true;
    return this.profileService.getProfile().subscribe({
      next: (v:any) => {
        // console.log(v.data.profile);
        if(v.data.profile === undefined){
          this.profileAvailable = false;
        }else {
          this.profile = v.data.profile
          this.profile.email = v.data.email;
          this.profile.posts = this.posts.length;
          this.profileAvailable = true;
        }
        this.isLoading = false;
      }
    })
  }

  openProfileDialog(mode:string): void {
    const dialogRef = this.dialog.open(AddProfileComponent, {
      width: '280px',
      data: mode,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  ngOnDestroy(): void {
      this.profileAddNotifier.unsubscribe();
  }

}
