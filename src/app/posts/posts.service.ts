import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { isThisHour } from "date-fns";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { PostModel } from "./post.mode";

@Injectable({
    providedIn:"root"
})
export class PostService{
    url = environment.url;
    postListener = new Subject<null>();

    constructor(private http:HttpClient){}

    getAddPostListener(){
        this.postListener.next(null);
    }

    getMyPosts(){
        return this.http.get(`${this.url}/profile/posts`);
    }

    //for getting a particular post of the user
    getPost(id:string){
        return this.http.get(`${this.url}/profile/posts/${id}`);
    }

    getAllPosts(){
        return this.http.get(`${this.url}/profile/posts/all`);
    }

    addPost(post:PostModel){
        const postData = new FormData();
        postData.append('title', post.title);
        postData.append('caption', post.caption);
        postData.append('image', post.image);

        return this.http.post(`${this.url}/profile/newPost`, postData);
    }

    deletePost(id:string){
        return this.http.delete(`${this.url}/profile/posts/${id}`);
    }

    updatePost(id:string, updatedPost:PostModel){
        return this.http.put(`${this.url}/profile/posts/${id}`, updatedPost);
    }

    likePost(id:string, username:string){
        return this.http.patch(`${this.url}/likePost/${id}`, username);
    }

    commentPost(id:string, comment:string){
        return this.http.patch(`${this.url}/comment/${id}`, comment);
    }

    getComments(postId:string){
        return this.http.get(`${this.url}/comments/${postId}`);
    }
}