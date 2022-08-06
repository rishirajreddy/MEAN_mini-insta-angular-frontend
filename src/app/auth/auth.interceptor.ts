import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService:AuthService, private route:Router){}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        const authToken = this.authService.getToken();
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer "+authToken)
        });
        return next.handle(authRequest)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                // console.log(error.error.msg);
                if(error && error.status === 401 && error.error.msg === "Invalid Token"){
                    console.log('Not Authorized');
                    console.log('Logged Out');
                    this.authService.loggingOut();
                    this.route.navigate(['/'])
                    // localStorage.clear();
                  }
                  const err = error.error.msg;
                  return throwError(err);
            })
        )
    }
}