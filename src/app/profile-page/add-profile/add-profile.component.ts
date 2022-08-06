import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FileCheck } from 'angular-file-validator';
import { HeaderService } from 'src/app/header/header.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.css']
})
export class AddProfileComponent implements OnInit {

   myForm!:FormGroup;
   imagePreview!: string;

   profile = {
    name:String,
    bio:String,
    dp:File
   }

  constructor(
    public dialogRef:MatDialogRef<AddProfileComponent>,
    private profileService:ProfileService,
    private route:Router,
    private profService:ProfileService,
    private _snackBar: MatSnackBar,
    private headerService:HeaderService,
    @Inject (MAT_DIALOG_DATA) public mode:string
  ) { }

  ngOnInit(){
    if(this.mode === 'edit'){
      this.profService.getProfile().subscribe({
        next: (v:any) => {
          this.profile = v.data.profile
          // console.log(this.profile);
          this.myForm.setValue({
            name: this.profile.name,
            bio: this.profile.bio,
            image: this.profile.dp
          });
          this.imagePreview = this.myForm.value.image;
          // console.log(this.myForm.value);
        }
      })
    }
      this.myForm = new FormGroup({
        name: new FormControl(null, 
            {validators: [Validators.required, Validators.minLength(3)]}
          ),
        bio: new FormControl(null,
          {validators: [Validators.required, Validators.minLength(6)]}
          ),
        image: new FormControl(null, 
          {validators:[Validators.required],
          asyncValidators: [FileCheck.ngFileValidator(['png', 'jpeg', 'jpg'])]
          }
          )
      })
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

  onSaveProfile(){
    if(this.mode === 'add'){
      this.profileService.addProfile(
        this.myForm.value.name,
        this.myForm.value.bio,
        this.myForm.value.image
        )
        .subscribe({
          next: (response) => {
            console.log(response);
            this.profService.getProfileAddListener();
            this.headerService.getListenToHeader();
            this._snackBar.open("Profile Created","", {
              duration: 2*1000,
              verticalPosition: "top",
              panelClass: "profile-added"
            })
          }
        })
    } else {
      this.profileService.updateProfile(
        this.myForm.value.name,
        this.myForm.value.bio,
        this.myForm.value.image
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.profService.getProfileAddListener();
        }
      })
    }
    // console.log(this.myForm);
    this.myForm.reset();
    this.onNoClick();
    this.route.navigate(['/profile']);
  }
  onNoClick(){
    this.dialogRef.close();
  }
}
