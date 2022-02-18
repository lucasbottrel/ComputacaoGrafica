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
  
  enableGrid: boolean = false;
  buttonSelected: string = "";
  
  @Input('enableGrid')
  set ENABLEGRID(enableGrid:any) {
    this.enableGrid = enableGrid;
    console.log("Canvas input",this.enableGrid);
  }
  @Input('buttonSelected')
  set BUTTONSELECTED(buttonSelected: any){
    this.buttonSelected = buttonSelected;
    console.log("Canvas input",this.buttonSelected);
  }
  
  private readonly destroy$: Subject<void> = new Subject<void>();

  lines: string[] = ["00","01","02","03","04","05","06","07","08","09","10",
                     "11","12","13","14","15","16","17","18","19","20","21",
                     "22","23","24","25","26","27","28"];
  columns: string[] = this.lines;
  width: number = 0;
  height: number = 0;
  pixelSize = 21;
  
  paintingMode: any

  private color: string = "gray";

  constructor(
    private host: ElementRef,
    private gridService: DrawingGridService,

  ) {}

  ngOnInit() {

    console.log("Canvas onInit", this.enableGrid);
    
    this.gridService.paintingMode$.pipe(takeUntil(this.destroy$)).subscribe((paintingMode) => {
      this.paintingMode = paintingMode;
    });

    this.width = 600;
    this.height = 600;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMouseDown(pixel: Pixel) {
    this.enableGrid ? this.fillPixel(pixel.x, pixel.y) : "";
  }


  onMouseUp(pixel: Pixel) {}

  onContextMenu(pixel: Pixel) {
    this.gridService.clearPixel(pixel.x, pixel.y);
  }

  private fillPixel(x: number, y: number) {
    if (this.paintingMode === PaintingMode.ERASE) {
      this.gridService.clearPixel(x, y);
      return;
    }
    console.log("Pixel colorido?",x,y);
    
    this.gridService.fillPixel(x, y, this.color);
  }
}
