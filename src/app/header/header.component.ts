import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FileCheck } from 'angular-file-validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { PostService } from '../posts/posts.service';
import { Profile } from '../profile-page/profile.model';
import { ProfileService } from '../profile-page/profile.service';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  openPopOver!:string;
  profile!:Profile
  imagePath!:File | string ;

  
  constructor(private auth:AuthService,
    private profService:ProfileService, 
    private route:Router,
    private dialog:MatDialog,
    private _snacBar: MatSnackBar,
    private headerService:HeaderService
    ) { }

    listenSub:Subscription = this.headerService.listenToLoadHeader.subscribe({
      next: (notifier) => {
        this.getProfile();
      }
    })
    
  ngOnInit(){
    this.getProfile();
  }

  getProfile(){
    return this.profService.getProfile().subscribe({
      next: (profile:any) => {
          this.profile = profile.data.profile;
          if(!this.profile){
            this.imagePath = "../../assets/images/default-profile.png";
          }else {
            this.imagePath = this.profile.dp;
          }
          // console.log(this.profile);
      }
    }) 
  }

  openProfileDialog(): void {
    const dialogRef = this.dialog.open(PickPostModalComponent, {
      width: '280px',
      // data: mode,  
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  logout(){
    this.auth.loggingOut();
    // this._snacBar.open("Logged Out", "", {
    //   duration: 3*1000,
    //   verticalPosition: "top",
    //   panelClass: "auth-logout"
    // })
    this.route.navigate(['/']);
  }
}

//modal component for selecting post
@Component({
  selector: 'app-pickImage-modal',
  templateUrl: './pick-image-modal.component.html',
  styleUrls: ['./header.component.css']
})
export class PickPostModalComponent implements OnInit{

  myForm!:FormGroup
  imagePreview!:string;
  isLoading = false;
  
  constructor(
    private postService:PostService,
    private route:Router,
    private _snacBar:MatSnackBar,
    public dialogRef:MatDialogRef<PickPostModalComponent>){}
  
  ngOnInit() {
    this.myForm = new FormGroup({
      title: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]}
        ),
      caption: new FormControl(null,
          {validators: [Validators.required, Validators.minLength(3)]}
        ),
      image: new FormControl(null,
          {
            validators: [Validators.required],
            asyncValidators: [FileCheck.ngFileValidator(['png', 'jpeg', 'jpg'])]
          }
        )
    })    
  }

  onSubmit(){
    this.isLoading = true;
     this.postService.addPost(this.myForm.value)
      .subscribe({
        next: (response) => { 
          console.log(response);
          this.postService.getAddPostListener();
          this.route.navigate(['/home']);
          this.isLoading = false;
          this._snacBar.open("Post Added", "", {
            duration: 2*1000,
            verticalPosition: "top",
            panelClass: "post-added"
          })
        }
      })
      this.onNoClick();
    console.log(this.myForm.value);
  }

  onImageSelected(event:Event){
    const file = (event.target as HTMLInputElement).files?.item(0);
    this.myForm.patchValue({image: file});
    this.myForm.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    if(!file){
      return;
    }
    reader.readAsDataURL(file as Blob);
  }

  onNoClick(){
    this.dialogRef.close();
  }    
    
}
