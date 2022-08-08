import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PostDetailsComponent } from 'src/app/posts/post-details/post-details.component';
import { PostModel } from 'src/app/posts/post.mode';
import { PostService } from 'src/app/posts/posts.service';
import { ProfileService } from 'src/app/profile-page/profile.service';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.css']
})
export class OtherProfileComponent implements OnInit {

  postUsername!:string;
  postId!:string;
  posts:PostModel[] = [];
  isLoading = false;
  profile = {
    name:"",
    username:"",
    email:"",
    bio:"",
    dp:"",
    posts:0
  };
  postsCount!:number;
  filteredPost!:PostModel;

  constructor(private route:ActivatedRoute, 
    private postService:PostService,
    private profService:ProfileService,
    private dialog:MatDialog
    ) {
    this.postId = this.route.snapshot.paramMap.get("id")!;
  }
  
  ngOnInit() {
    this.onGetPost();
    // console.log(this.postId);
  }

  onGetPost(){
    this.isLoading = true;
    return this.postService.getOthersPost(this.postId)
      .subscribe({
        next: (response:any) => {
          console.log(response);
          this.postUsername = response.username;
          this.onGetOthersProfile();
          this.onGettingPosts();
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        }
      })
  }

  onGetOthersProfile(){
    return this.profService.getOthersProfile(this.postUsername)
      .subscribe({
        next: (response:any) => {
            console.log(response);
            this.profile.email = response.profile.email;
            this.profile.name = response.profile.profile.name;
            this.profile.bio= response.profile.profile.bio;
            this.profile.username = response.profile.username;
            this.profile.dp = response.profile.profile.dp;
            this.isLoading = false;
        }
      })
  }

  onGettingPosts(){
    return this.postService.getOthersPosts(this.postUsername)
      .subscribe({
        next: (res:any) => {
          this.posts = res;
          this.profile.posts = res.length;
          this.isLoading = false;
        }
      })
  }

  openPostDetailsDialog(id:string){
    this.posts.filter((post) => {
      if(post._id === id){
        this.filteredPost = post;
      }
    })
    const dialogRef = this.dialog.open(PostDetailsComponent, {
      width: '600px',
      data: this.filteredPost,
      panelClass: 'my-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  

}
