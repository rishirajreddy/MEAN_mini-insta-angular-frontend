import { Component, Inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostModel } from '../posts/post.mode';
import { PostService } from '../posts/posts.service';
import { compareAsc, compareDesc, formatDistance, parseISO } from 'date-fns';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LikeDetailsComponent } from '../posts/post-details/post-details.component';
import { ProfileService } from '../profile-page/profile.service';
import { Profile } from '../profile-page/profile.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  username!: string;
  posts:PostModel[] = [];
  currentDate!:Date;
  isLoading = false;
  profile!:Profile;
  openPopOver!:string;
  imagePath!:File | string;

  constructor(private postService:PostService,
    private profService:ProfileService, 
      private dialog:MatDialog,
      ) { }
  postAddNotifier:Subscription = this.postService.postListener
      .subscribe({
        next: (notifier) => {
          this.loadPosts();
        }
      })

  ngOnInit(){
    this.username = localStorage.getItem("username")!;
    this.currentDate = new Date();
    this.loadPosts();
    this.loadProfile();
  }

    formatDate(start:Date, end:string) {
      return formatDistance(start, parseISO(end))+" ago";
  }

  loadPosts(){
    this.isLoading = true;
    return this.postService.getAllPosts().subscribe({
      next: (response:any) => {
        this.posts = response;
        console.log(this.posts);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false
      }
    })
  }

  loadProfile(){
    return this.profService.getProfile().subscribe({
      next: (v:any) => {
        this.profile = v.data.profile;
        if(!this.profile){
          this.openPopOver = "Add a profile to like & comment on posts!!";
        }else {
          this.openPopOver = "";
        }
      }
    })
  }

  onPostLiked(id:string){
    this.postService.likePost(id, this.username)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.loadPosts();
        }
      })
  }

  checkLike(post:PostModel){
    const exists = post.likedBy.some(({username}) => username === this.username);
    return exists;
  }

openAddCommentDialog(post:PostModel){
  const dialogRef = this.dialog.open(AddCommentDialogComponent, {
    width: '800px',
    data: post
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // this.animal = result;
  });
}


openViewLikesModal(post:PostModel){
  const dialogRef = this.dialog.open(LikeDetailsComponent, {
    width: '280px',
    data: post
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // this.animal = result;
  });
}

}


@Component({
  selector: 'add-comment-dialog',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./home-page.component.css']
})

export class AddCommentDialogComponent implements OnInit{
  
  constructor(public dialogRef:MatDialogRef<AddCommentDialogComponent>,
    public dialog:MatDialog,
    private route:Router,
    private postService:PostService,
    private profService:ProfileService,
    @Inject (MAT_DIALOG_DATA) public post:PostModel){}

    commentsArr:any = [];
    postsArr!:PostModel[];
    currentDate!:Date;
    profile!:Profile;
    openPopOver!:string;

    ngOnInit() {
      this.loadProfile();
      this.currentDate = new Date();
      this.commentsArr = this.post.commentedBy.flat().sort((a,b) => 
        compareAsc(parseISO(a.commentedAt), parseISO(b.commentedAt))
      );
      // console.log(this.commentsArr);
    }

    // distanceInWords.substring(distanceInWords.indexOf(distanceInWords.match(/\d+/g)))

    formatDate(start:Date, end:string) {
      const distance:any = formatDistance(start, parseISO(end));
      return distance.substring(distance.indexOf(distance.match(/\d+/g)));
  }

    onPostComment(form:NgForm){
      this.postService.commentPost(this.post._id, form.value)
        .subscribe({
          next: (response) => {
            this.route.navigate(['/home']);
            this.postService.getAddPostListener();
            console.log(response);
            this.onNoClick();
          }
        })
    }

    loadProfile(){
      return this.profService.getProfile().subscribe({
        next: (v:any) => {
          this.profile = v.data.profile;
          if(!this.profile){
            this.openPopOver = "Add a profile to like & comment on posts!!";
          }else {
            this.openPopOver = "";
          }
        }
      })
    }
    // loadAllPosts(){
    //   return this.postService.getAllPosts()
    //     .subscribe({
    //       next: (posts:any) => {
    //         this.postsArr = posts;
    //         console.log(this.postsArr);
    //       }
    //     })
    // }

    onNoClick(){
      this.dialogRef.close();
    }
  }