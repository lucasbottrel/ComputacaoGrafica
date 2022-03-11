import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  @Output() enableGridEvent = new EventEmitter<boolean>();
  @Output() buttonSelectedEvent = new EventEmitter<string>();
  @Output() fatorEvent = new EventEmitter<any>();

  enableGrid = false;
  buttonSelected: string = '';
  raio: any;
  fatorX: any;
  fatorY: any;
  escalaX:any;
  escalaY:any;
  angulo: any;

  constructor() {}

  ngOnInit(): void {}

  selectRetasDDA() {
    this.enableGrid = true;
    this.enableGridEvent.emit(this.enableGrid);
    this.buttonSelected = 'retasDDA';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectRetasBresenham() {
    this.enableGrid = true;
    this.enableGridEvent.emit(this.enableGrid);
    this.buttonSelected = 'retasBresenham';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectCirculoBresenham() {
    this.enableGrid = true;
    this.enableGridEvent.emit(this.enableGrid);
    this.buttonSelected = 'circuloBresenham';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectTranslacao(){
    this.enableGrid = false;
    this.buttonSelected = 'translacao';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectRotacao(){
    this.enableGrid = false;
    this.buttonSelected = 'rotacao';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectEscala(){
    this.enableGrid = false;
    this.buttonSelected = 'escala';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectReflexao(){
    this.enableGrid = false;
    this.buttonSelected = 'reflexao';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  enviarParametros(){
    this.enableGrid = false;
    if(this.buttonSelected === 'translacao') this.fatorEvent.emit({x: this.fatorX, y: this.fatorY});
    else if(this.buttonSelected === 'rotacao') this.fatorEvent.emit({r: this.angulo});
    else if(this.buttonSelected === 'escala') this.fatorEvent.emit({x: this.escalaX, y:this.escalaY})
    this.fatorX = "";
    this.fatorY = "";
    this.escalaX = "";
    this.escalaY = "";
    this.angulo = "";
  }
}
