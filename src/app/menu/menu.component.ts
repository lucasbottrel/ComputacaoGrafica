import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<boolean>();

  enableGrid = false;

  constructor() { }

  ngOnInit(): void {
  }

  selectRetasDDA(){
    this.enableGrid = true;
    this.messageEvent.emit(this.enableGrid);
  }

}
