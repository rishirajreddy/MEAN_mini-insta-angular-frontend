import { Component, OnInit } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  date = new Date();
  year = this.date.getFullYear();

  constructor() { }

  ngOnInit(): void {
    // console.log(this.year);
    // this.currentYear = this.currentYear.getFullYear();
  }

}
