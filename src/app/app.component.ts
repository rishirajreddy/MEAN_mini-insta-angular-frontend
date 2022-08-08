import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile-page/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'infinity-gram-angular';
  
  constructor(private profService:ProfileService){}

  ngOnInit(){
  }
}
