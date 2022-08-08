import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, shareReplay, Subject } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { Profile } from "./profile.model";

@Injectable({
    providedIn:"root"
})
export class ProfileService{

    url = environment.url;
    addProfileListener = new Subject<null>();
    getProfilePage = new Subject();
    myEditedProfile = new BehaviorSubject(new FormData());

    myProfile$ = forkJoin(this.getProfile()).pipe(
        shareReplay(1)
    )

    constructor(private http:HttpClient){
    }
    
    getProfileAddListener(){
        this.addProfileListener.next(null);
    }

    getProfile(){
        return this.http.get(`${this.url}/profile`)
    }

    addProfile(name:string, bio:string, image:File){
        const profileData = new FormData();
        profileData.append('name', name);
        profileData.append('bio', bio);
        profileData.append('image', image);
        return this.http.post(`${this.url}/profile`, profileData);
    }

    updateProfile(name:string, bio:string, image:File){
        const profileData = new FormData();
        profileData.append('name', name);
        profileData.append('bio', bio);
        profileData.append('image', image);
        this.myEditedProfile.next(profileData);
        return this.http.put(`${this.url}/profile`, profileData);
    }

    getOthersProfile(username:string){
        return this.http.get(`${this.url}/profile/profileId/${username}`);
    }
}