import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  @Output() buttonSelectedEvent = new EventEmitter<string>();
  @Output() fatorEvent = new EventEmitter<any>();

  buttonSelected: string = '';
  reflexaoButtonSelected: string = ''
  raio: any;
  fatorX: any;
  fatorY: any;
  escalaX:any;
  escalaY:any;
  angulo: any;

  constructor() {}

  ngOnInit(): void {}

  selectRetasDDA() {
    this.buttonSelected = 'retasDDA';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectRetasBresenham() {
    this.buttonSelected = 'retasBresenham';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectCirculoBresenham() {
    this.buttonSelected = 'circuloBresenham';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectTranslacao(){
    this.reflexaoButtonSelected = '';
    this.buttonSelected = 'translacao';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectRotacao(){
    this.reflexaoButtonSelected = '';
    this.buttonSelected = 'rotacao';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectEscala(){
    this.reflexaoButtonSelected = '';
    this.buttonSelected = 'escala';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectReflexao(){
    this.buttonSelected = 'reflexao';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectReflexaoX(){
    this.reflexaoButtonSelected = 'x';
    this.fatorEvent.emit({"reflexao":"x"})
  }

  selectReflexaoY(){
    this.reflexaoButtonSelected = 'y';
    this.fatorEvent.emit({"reflexao":"y"})
  }

  selectReflexaoXY(){
    this.reflexaoButtonSelected = 'xy';
    this.fatorEvent.emit({"reflexao":"xy"})
  }

  enviarParametros(){
    if(this.buttonSelected === 'translacao') this.fatorEvent.emit({x: this.fatorX, y: this.fatorY});
    else if(this.buttonSelected === 'rotacao') this.fatorEvent.emit({r: this.angulo});
    else if(this.buttonSelected === 'escala') this.fatorEvent.emit({x: this.escalaX, y:this.escalaY})
    this.fatorX = "";
    this.fatorY = "";
    this.escalaX = "";
    this.escalaY = "";
    this.angulo = "";
  }

  selectCohenSutherland(){
    this.buttonSelected = 'cohenSutherland';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }

  selectLiangBarsky(){
    this.buttonSelected = 'liangBarsky';
    this.buttonSelectedEvent.emit(this.buttonSelected);
  }
}
