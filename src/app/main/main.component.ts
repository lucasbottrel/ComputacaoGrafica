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
  transformacoes: any;

  constructor() { }

  ngOnInit(): void {
    
  }

  enableGridMessage($event: any){
    this.enableGrid = $event;
    
  }

  buttonSelectedMessage($event: any){
    this.buttonSelected = $event;
  }

  transformacoesMessage($event: any){
    this.transformacoes = $event;
  }

}
