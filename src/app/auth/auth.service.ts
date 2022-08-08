import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { User } from "./user.mode";

@Injectable({
    providedIn: "root"
})

export class AuthService{
    url = `${environment.url}`
    authStateListener = new Subject<boolean>();
    private token!:string;

    constructor(private http:HttpClient, private _snackBar:MatSnackBar){}

    tokenAvailable(){
        return !!sessionStorage.getItem("token");
    }

    getToken(){
        this.token = sessionStorage.getItem('token')!;
        return this.token;
    }

    createUser(user:User){
        return this.http.post(`${this.url}/register`, user);
    }

    loginUser(user:Omit<User, "email">){
        return this.http.post(`${this.url}/login`, user);   
    }

    loggingOut(){
        this.clearAuthData();   
        this._snackBar.open("Logged Out","", {
            duration: 2*1000,
            verticalPosition: "top",
            panelClass: "auth-logout"
        })
    }

    saveAuthToken(token:string, username:string){
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('username', username);
    }

    autoLogOutUser(){
        
    }

    private clearAuthData(){
        sessionStorage.clear();
        localStorage.clear();
    }
}