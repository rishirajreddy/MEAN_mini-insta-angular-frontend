import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PostDetailsComponent } from '../post-details/post-details.component';
import { PostModel } from '../post.mode';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts:PostModel[] = [];
  isLoading = false;
  filteredPost!:PostModel;

  constructor(private postService:PostService, private dialog:MatDialog) { }
  postsListener:Subscription = this.postService.postListener
    .subscribe({
      next : (notifier) =>{
        this.gettingMyPosts();
      }
    })

  ngOnInit() {
    this.isLoading = true;
    this.gettingMyPosts();
  }

  gettingMyPosts(){
    return this.postService.getMyPosts()
    .subscribe({
      next: (v:any) => {
        this.posts = v;
        this.isLoading = false;
      }
    })
  }

  openPostDetailsDialog(id:string): void {
    this.posts.filter((post) => {
      if(post._id === id){
        this.filteredPost = post;
      }
    })
    const dialogRef = this.dialog.open(PostDetailsComponent, {
      width: '600px',
      data: this.filteredPost,
      panelClass: 'my-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
