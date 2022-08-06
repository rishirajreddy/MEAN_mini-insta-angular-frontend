import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGaurd implements CanActivate{
    
    constructor(private authService:AuthService, private route:Router){}

    canActivate(route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        
        if(!this.authService.tokenAvailable()) {
            this.route.navigate(['/'])
        }return this.authService.tokenAvailable();
    }
}