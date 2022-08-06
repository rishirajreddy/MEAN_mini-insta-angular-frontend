import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  hidePassword = false;
  myForm!: FormGroup;
  mode:string = "login";
  isLoading = false;

  constructor(private fb:FormBuilder, 
    private auth:AuthService,
    private route: Router,
    private _snackBar:MatSnackBar
    ) { }

  
  ngOnInit() {
    this.myForm = this.fb.group({
      email: ["",[Validators.email]],
      username: ["",[Validators.required,Validators.minLength(5)]],
      password: ["",[Validators.required, 
        Validators.minLength(6), 
        Validators.maxLength(10)]],
    });
  }
  
  onSubmit(form:FormGroup){
    this.isLoading = true;
    // console.log(form.value);
    if(this.mode === 'login'){
      this.auth.loginUser(form.value).subscribe({
        next: (response:any) => {
          if(response.msg === 'Login Success'){
            this._snackBar.open(`Logged in as ${form.value.username}`, "",{
              duration: 3*1000,
              verticalPosition: 'top',
              panelClass: "auth-success"
            }
            )
            console.log(response);
            this.auth.authStateListener.next(true);
            this.auth.saveAuthToken(response.token, response.username);
            this.route.navigate(['/home']);
            this.isLoading = false;
            this.auth.authStateListener.next(true);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this._snackBar.open(error, "",{
            duration: 4*1000,
            verticalPosition: 'top',
            panelClass: "auth-error"
          }
          )
          console.log(error);
        }
      })
    }else {
      this.auth.createUser(form.value)
      .subscribe({
        next: (response:any) => {
          if(response.msg === 'Registered Successfully'){
            this._snackBar.open(`Registered as ${form.value.username}`, "", {
              duration: 3*1000,
              verticalPosition: "top",
              panelClass: "auth-success"
            })
            console.log(response);
            this.auth.saveAuthToken(response.token,response.username);
            this.auth.authStateListener.next(true);
            this.route.navigate(['/home']);
            this.isLoading = false;
            this.auth.authStateListener.next(true);
          }
          },
          error: (error) => {
            this.isLoading = false;
            this._snackBar.open(error, "",{
              duration: 4*1000,
              verticalPosition: 'top',
              panelClass: "auth-error"
            }
            )
            console.log(error);
          }
        })
    }
  }


  changeMode(){
    this.mode === 'login' ? this.mode = 'signup' : this.mode = 'login';
    this.myForm.reset();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }


}
