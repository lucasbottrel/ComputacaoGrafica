import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  @Output() messageEvent = new EventEmitter<boolean>();

  buttonSelected: string = "";
  transformacoes: any;

  constructor() { }

  ngOnInit(): void {
    
  }

  buttonSelectedMessage($event: any){
    this.buttonSelected = $event;
  }

  transformacoesMessage($event: any){
    this.transformacoes = $event;
  }

}
