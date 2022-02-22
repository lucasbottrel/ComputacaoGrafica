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
    console.log('Canvas input', this.enableGrid);

    this.setNumPixels();
  }

  @Input('buttonSelected')
  set BUTTONSELECTED(buttonSelected: any) {
    this.buttonSelected = buttonSelected;
    console.log('Canvas input', this.buttonSelected);

    this.setNumPixels();
  }

  @Input('raio')
  set RAIO(raio: any) {
    this.circleRaio = raio;
    console.log('Canvas input', this.circleRaio);

    this.setNumPixels();
  }

  enableGrid: boolean = false;
  buttonSelected: string = '';

  width: number = 0;
  height: number = 0;
  pixelSize = 13;

  circleRaio: any = 3;

  numPixels: number = 0;
  paintedPixels: any = [];

  paintingMode: any;

  pixelColor: string = 'orange';

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

    this.width = 600;
    this.height = 600;
  }

  setNumPixels() {
    if (this.buttonSelected === 'retasDDA') {
      this.numPixels = 2;
    } else if (this.buttonSelected === 'retasBresenham') {
      this.numPixels = 2;
    } else if (this.buttonSelected === 'circuloBresenham') {
      this.numPixels = 1;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMouseDown(pixel: Pixel) {
    this.enableGrid && this.numPixels > 0
      ? this.fillPixel(pixel.x, pixel.y)
      : '';
    this.numPixels--;

    if (this.numPixels == 0 && this.buttonSelected == 'retasDDA') {
      this.dda();
    } else if (this.numPixels == 0 && this.buttonSelected == 'retasBresenham') {
      this.lineBresenham();
    } else if (
      this.numPixels == 0 &&
      this.buttonSelected == 'circuloBresenham'
    ) {
      this.circleBresenham();
    }
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
      x += xInc;
      y += yInc;
    }
  }

  lineBresenham() {
    let dx = this.paintedPixels[1].x - this.paintedPixels[0].x;
    let dy = this.paintedPixels[1].y - this.paintedPixels[0].y;

    let x = this.paintedPixels[0].x;
    let y = this.paintedPixels[0].y;

    const absdx = Math.abs(dx);
    const absdy = Math.abs(dy);

    this.gridService.fillPixel(x, y, 'white');

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
      }
    }
  }

  drawCircle(xc: any, yc: any, x: any, y: any) {
    this.gridService.fillPixel(xc + x, yc + y, 'white');
    this.gridService.fillPixel(xc + x, yc + y, 'white');
    this.gridService.fillPixel(xc - x, yc + y, 'white');
    this.gridService.fillPixel(xc + x, yc - y, 'white');
    this.gridService.fillPixel(xc - x, yc - y, 'white');
    this.gridService.fillPixel(xc + y, yc + x, 'white');
    this.gridService.fillPixel(xc - y, yc + x, 'white');
    this.gridService.fillPixel(xc + y, yc - x, 'white');
    this.gridService.fillPixel(xc - y, yc - x, 'white');
  }

  circleBresenham() {
    let xc = this.paintedPixels[0].x;
    let yc = this.paintedPixels[0].y;
    let raio = this.circleRaio;
    let x = 0;
    let y = raio;

    let d = 3 - 2 * raio;
    this.drawCircle(xc, yc, x, y);
    while (y >= x) {
      x++;

      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else d = d + 4 * x + 6;
      this.drawCircle(xc, yc, x, y);
    }
    this.gridService.clearPixel(xc, yc);
  }

  cleanCanvas() {

    for (let x = 0; x <=45; x++) {
      for (let y = 0; y <= 45; y++) {
        this.gridService.clearPixel(x, y);
      }
    }
    this.paintedPixels = [];
    this.setNumPixels();
  }
}
