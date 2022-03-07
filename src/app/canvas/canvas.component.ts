import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DrawingGridService, Pixel, PaintingMode } from 'ngx-drawing-grid';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input('enableGrid')
  set ENABLEGRID(enableGrid: any) {
    this.enableGrid = enableGrid;


    this.setNumPixels();
  }

  @Input('buttonSelected')
  set BUTTONSELECTED(buttonSelected: any) {
    this.buttonSelected = buttonSelected;

    this.setNumPixels();
    this.paintedPixels = [];
  }

  enableGrid: boolean = false;
  buttonSelected: string = '';

  centerPixel = {x: 17, y:17}
  width: number = 0;
  height: number = 0;
  pixelSize = 13;

  numPixels: number = 0;
  paintedPixels: any = [];
  objPixels:any = [];

  paintingMode: any;

  pixelColor: string = 'orange';

  gridObjects:any = [];

  constructor(
    private host: ElementRef,
    private gridService: DrawingGridService
  ) {}

  ngOnInit() {
    this.gridService.paintingMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((paintingMode) => {
        this.paintingMode = paintingMode;
      });

    this.width = 500;
    this.height = 500;
  }

  setNumPixels() {
    if (this.buttonSelected === 'retasDDA') {
      this.numPixels = 2;
    } else if (this.buttonSelected === 'retasBresenham') {
      this.numPixels = 2;
    } else if (this.buttonSelected === 'circuloBresenham') {
      this.numPixels = 2;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMouseDown(pixel: Pixel) {
    
    if(this.enableGrid && this.numPixels > 0){
      this.fillPixel(pixel.x, pixel.y)
      this.numPixels--
    }

    if (this.numPixels == 0 && this.buttonSelected == 'retasDDA') {
      this.dda();
      this.paintedPixels = [];
      this.setNumPixels();
      
    } else if (this.numPixels == 0 && this.buttonSelected == 'retasBresenham') {
      this.lineBresenham();
      this.paintedPixels = [];
      this.setNumPixels();

    } else if ( this.numPixels == 0 && this.buttonSelected == 'circuloBresenham') {
      this.circleBresenham();
      this.paintedPixels = [];
      this.setNumPixels();
    }

    console.log(this.gridObjects);
    
  }

  onContextMenu(pixel: Pixel) {
    this.gridService.clearPixel(pixel.x, pixel.y);
  }

  private fillPixel(x: number, y: number) {
    console.log('Pixel colorido?', x, y);
    this.paintedPixels.push({ x: x, y: y });
    console.log(this.paintedPixels);

    this.gridService.fillPixel(x, y, this.pixelColor);
  }

  dda() {    
    let deltaX = this.paintedPixels[1].x - this.paintedPixels[0].x;
    let deltaY = this.paintedPixels[1].y - this.paintedPixels[0].y;

    let steps =
      Math.abs(deltaX) > Math.abs(deltaY) ? Math.abs(deltaX) : Math.abs(deltaY);

    let xInc = deltaX / steps;
    let yInc = deltaY / steps;

    let x = this.paintedPixels[0].x;
    let y = this.paintedPixels[0].y;

    for (let i = 0; i <= steps; i++) {
      this.gridService.fillPixel(Math.round(x), Math.round(y), 'white');
      this.objPixels.push({x: Math.round(x),y: Math.round(y)});
      x += xInc;
      y += yInc;
    }

    this.gridObjects.push(this.objPixels);
    this.objPixels = [];
  }

  lineBresenham() {
    let dx = this.paintedPixels[1].x - this.paintedPixels[0].x;
    let dy = this.paintedPixels[1].y - this.paintedPixels[0].y;

    let x = this.paintedPixels[0].x;
    let y = this.paintedPixels[0].y;

    const absdx = Math.abs(dx);
    const absdy = Math.abs(dy);

    this.gridService.fillPixel(x, y, 'white');
    this.objPixels.push(x,y);

    // slope < 1
    if (absdx > absdy) {
      let d = 2 * absdy - absdx;

      for (let i = 0; i < absdx; i++) {
        x = dx < 0 ? x - 1 : x + 1;
        if (d < 0) {
          d = d + 2 * absdy;
        } else {
          y = dy < 0 ? y - 1 : y + 1;
          d = d + (2 * absdy - 2 * absdx);
        }
        this.gridService.fillPixel(x, y, 'white');
        this.objPixels.push(x,y);
      }
    } else {
      // case when slope is greater than or equals to 1
      let d = 2 * absdx - absdy;

      for (let i = 0; i < absdy; i++) {
        y = dy < 0 ? y - 1 : y + 1;
        if (d < 0) d = d + 2 * absdx;
        else {
          x = dx < 0 ? x - 1 : x + 1;
          d = d + 2 * absdx - 2 * absdy;
        }
        this.gridService.fillPixel(x, y, 'white');
        this.objPixels.push(x,y);
      }
    }
    this.gridObjects.push(this.objPixels);
    this.objPixels = [];
  }

  drawCircle(xc: any, yc: any, x: any, y: any) {
    this.gridService.fillPixel(xc + x, yc + y, 'white');
    this.objPixels.push(xc + x, yc + y);
    this.gridService.fillPixel(xc + x, yc + y, 'white');
    this.objPixels.push(xc + x, yc + y);
    this.gridService.fillPixel(xc - x, yc + y, 'white');
    this.objPixels.push(xc + x,yc + y);
    this.gridService.fillPixel(xc + x, yc - y, 'white');
    this.objPixels.push(xc + x,yc + y);
    this.gridService.fillPixel(xc - x, yc - y, 'white');
    this.objPixels.push(xc + x,yc + y);
    this.gridService.fillPixel(xc + y, yc + x, 'white');
    this.objPixels.push(xc + x,yc + y);
    this.gridService.fillPixel(xc - y, yc + x, 'white');
    this.objPixels.push(xc + x,yc + y);
    this.gridService.fillPixel(xc + y, yc - x, 'white');
    this.objPixels.push(xc + x,yc + y);
    this.gridService.fillPixel(xc - y, yc - x, 'white');
    this.objPixels.push(xc + x,yc + y);
  }

  calculateRadius(x1:number, y1:number, x2:number, y2:number){
    return Math.ceil( Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
  }

  circleBresenham() {
    let xc = this.paintedPixels[0].x;
    let yc = this.paintedPixels[0].y;

    let raio = this.calculateRadius(xc, yc, this.paintedPixels[1].x, this.paintedPixels[1].y)
    this.gridService.clearPixel(this.paintedPixels[1].x, this.paintedPixels[1].y);
    
    let x = 0;
    let y = raio;

    let p = 3 - 2 * raio;
    this.drawCircle(xc, yc, x, y);
    while (y >= x) {
      x++;

      if (p > 0) {
        y--;
        p = p + 4 * (x - y) + 10;
      } else p = p + 4 * x + 6;
      this.drawCircle(xc, yc, x, y);
    }
    this.gridObjects.push(this.objPixels);
    this.gridService.clearPixel(xc, yc);
    this.objPixels = [];
    
  }

  cleanCanvas() {

    for (let x = 0; x <=38; x++) {
      for (let y = 0; y <= 38; y++) {
        this.gridService.clearPixel(x, y);
      }
    }
    this.paintedPixels = [];
    this.gridObjects = [];
    this.setNumPixels();
  }
}
