import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DrawingGridService, Pixel, PaintingMode } from 'ngx-drawing-grid';
import { setLines } from '@angular/material/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy{
  
  private readonly destroy$: Subject<void> = new Subject<void>();
  
  @Input('enableGrid')
  set ENABLEGRID(enableGrid:any) {
    this.enableGrid = enableGrid;
    console.log("Canvas input",this.enableGrid);
  }
  @Input('buttonSelected')
  set BUTTONSELECTED(buttonSelected: any){
    this.buttonSelected = buttonSelected;
    console.log("Canvas input",this.buttonSelected);

    this.setNumPixels()
  }
  
  enableGrid: boolean = false;
  buttonSelected: string = "";

  width: number = 0;
  height: number = 0;
  pixelSize = 21;

  numPixels: number = 0;
  paintedPixels: any = [];
  
  paintingMode: any;

  pixelColor: string = "gray";

  constructor(
    private host: ElementRef,
    private gridService: DrawingGridService,

  ) {}

  ngOnInit() {

    this.gridService.paintingMode$.pipe(takeUntil(this.destroy$)).subscribe((paintingMode) => {
      this.paintingMode = paintingMode;
    });

    this.width = 600;
    this.height = 600;
  }

  setNumPixels(){
    if(this.buttonSelected === "retasDDA"){
      this.numPixels = 2;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMouseDown(pixel: Pixel) {
    if(this.numPixels == 2) this.pixelColor = "orange";
    if(this.numPixels == 1) this.pixelColor = "blue";

    this.enableGrid && this.numPixels > 0 ? this.fillPixel(pixel.x, pixel.y) : "";
    this.numPixels--;

    if(this.numPixels == 0) this.dda();

  }

  onContextMenu(pixel: Pixel) {
    this.gridService.clearPixel(pixel.x, pixel.y);
  }

  private fillPixel(x: number, y: number) {
    if (this.paintingMode === PaintingMode.ERASE) {
      this.gridService.clearPixel(x, y);
      return;
    }
    console.log("Pixel colorido?",x,y);
    this.paintedPixels.push({x:x,y:y})
    console.log(this.paintedPixels);
    
    this.gridService.fillPixel(x, y, this.pixelColor);
  }

  dda(){
    let deltaX = this.paintedPixels[1].x - this.paintedPixels[0].x;
    let deltaY = this.paintedPixels[1].y - this.paintedPixels[0].y;

    let steps = Math.abs(deltaX) > Math.abs(deltaY) ? Math.abs(deltaX) : Math.abs(deltaY);

    let xInc = deltaX / steps;
    let yInc = deltaY / steps;

    let x = this.paintedPixels[0].x;
    let y = this.paintedPixels[0].y;

    for (let i = 0; i <= steps; i++) {
      
      this.gridService.fillPixel(Math.round(x), Math.round(y), "white");
      x += xInc;
      y += yInc;
    }
  }

  cleanCanvas(){
    for (let x = 0; x <= 27; x++){
      for (let y = 0; y <= 27; y++) {
        this.gridService.clearPixel(x, y); 
      }
    }
    this.paintedPixels = [];
    this.setNumPixels()
  }
}
