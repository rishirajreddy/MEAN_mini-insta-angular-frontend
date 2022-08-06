import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { compareAsc, parseISO } from 'date-fns';
import { Profile } from 'src/app/profile-page/profile.model';
import { ProfileService } from 'src/app/profile-page/profile.service';
import { PostModel } from '../post.mode';
import { PostService } from '../posts.service';


@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  commentsArr:any = [];

  constructor(
    private postService:PostService,
    private profService:ProfileService,
    private dialog:MatDialog,
    public dialogRef:MatDialogRef<PostDetailsComponent>,
    @Inject (MAT_DIALOG_DATA) public post:PostModel
  ) { }

  ngOnInit()  {
    // console.log(this.post);
      this.commentsArr = this.post.commentedBy.flat().sort((a,b) => 
        compareAsc(parseISO(a.commentedAt), parseISO(b.commentedAt))
      )
  }

  openLikesModal(){
    const dialogRef = this.dialog.open(LikeDetailsComponent, {
      width: '280px',
      data:this.post
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  openEditPostModal(mode:string, post:PostModel){
    const dialogRef = this.dialog.open(EditPostModalComponent, {
      width: '280px',
      data: {mode, post}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  onCloseDialog(){
    this.dialogRef.close();
  }
}


//for opening edit post modal
@Component({
  selector: 'edit-post-modal',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./post-details.component.css']
})
export class EditPostModalComponent implements OnInit{
  
  myForm!:FormGroup;
  isLoading = false;

  constructor(
    private postService:PostService,
    private profService:ProfileService,
    private route:Router,
    private fb:FormBuilder,
    public dialogRef:MatDialogRef<EditPostModalComponent>,
    public dialog:MatDialog,
    private _snackBar:MatSnackBar,
    @Inject (MAT_DIALOG_DATA) public data:{mode:string, post:PostModel}
    ){}
    
    ngOnInit(){
      if(this.data.mode === 'edit'){
        this.myForm = this.fb.group({
          title: [this.data.post.title, [Validators.minLength(3)]],
          caption: [this.data.post.caption, [Validators.minLength(3)]],
        })
      }
    }

    onDoneEdit(){
      this.isLoading = true;
      if(this.myForm.value.caption.length === 0 || this.myForm.value.title.length === 0){
        this.postService.updatePost(this.data.post._id,this.data.post)
          .subscribe({
            next: (response) => {
              console.log(response);
              this.isLoading = false;
              this.dialog.closeAll();
              this.postService.getAddPostListener();
            }
          })
      }else {
        this.isLoading = true;
        this.postService.updatePost(this.data.post._id,this.myForm.value)
          .subscribe({
            next: (response) => {
              console.log(response);
              this.isLoading = false;
              this.dialog.closeAll();
              this.postService.getAddPostListener();
            }
          })
      }
    }

    onDeletePost(){
      this.postService.deletePost(this.data.post._id)
        .subscribe({
          next: (response) => {
            this.postService.getAddPostListener();
            this.profService.getProfileAddListener();
            this.route.navigate(['/profile']);
            this._snackBar.open("Post Deleted","", {
              duration: 2*1000,
              verticalPosition: "top",
              panelClass: "auth-success"
            })
            console.log(response);
            this.dialog.closeAll();
          }
        })
    }

  onNoClick(){
    this.dialogRef.close();
  }
}

//open like details modal
@Component({
  selector: 'like-details-modal',
  templateUrl: './view-likes.component.html',
  styleUrls: ['./post-details.component.css']  
})

export class LikeDetailsComponent implements OnInit{
  
  constructor(public dialogRef:MatDialogRef<LikeDetailsComponent>,
    @Inject (MAT_DIALOG_DATA) public post:PostModel
    ){}

    ngOnInit(): void {
        console.log();
    }

  onClose(){
    this.dialogRef.close();
  }
}
