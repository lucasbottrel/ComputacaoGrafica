import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @Output() messageEvent = new EventEmitter<boolean>();

  enableGrid: boolean = false;
  buttonSelected: string = "";

  constructor() { }

  ngOnInit(): void {
    
  }

  enableGridMessage($event: any){
    this.enableGrid = $event;
    console.log("main:",this.enableGrid);
    
  }

  buttonSelectedMessage($event: any){
    this.buttonSelected = $event;
    console.log("main:",this.buttonSelected)
  }

}