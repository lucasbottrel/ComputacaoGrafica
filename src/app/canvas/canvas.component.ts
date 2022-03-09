import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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

  @Input('transformacoes')
  set TRANSFORMACOES(transformacoes: any) {
    this.transformacoes = transformacoes;
    console.log(this.transformacoes);

    if (this.buttonSelected === 'translacao') this.translacao();
    if (this.buttonSelected === 'rotacao') this.rotacao();
    if (this.buttonSelected === 'escala') this.escala();
  }

  enableGrid: boolean = false;
  buttonSelected: string = '';
  transformacoes: any;

  centerPixel = { x: 35, y: 35 };
  width: number = 500;
  height: number = 500;
  pixelSize = 7;

  numPixels: number = 0;
  paintedPixels: any = [];
  objPixels: any = [];
  drawType: string = '';

  paintingMode: any;

  pixelColor: string = 'orange';

  gridObject: any = [];

  constructor(private gridService: DrawingGridService) {}

  ngOnInit() {
    this.gridService.paintingMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((paintingMode) => {
        this.paintingMode = paintingMode;
      });
  }

  translacao() {
    let newGridObject: any;
    console.log(this.transformacoes);

    if (this.gridObject) {
      let obj = this.gridObject;
      let newObj: any[] = [];
      obj.forEach((pixel: { x: any; y: number }) => {
        newObj.push({
          x: pixel.x + this.transformacoes.x,
          y: pixel.y - this.transformacoes.y,
        });
      });
      newGridObject = newObj;
    }

    this.gridObject.forEach((pixel: { x: number; y: number }) => {
      this.gridService.clearPixel(pixel.x, pixel.y);
    });

    this.gridObject = newGridObject;

    this.gridObject.forEach((pixel: { x: number; y: number }) => {
      this.gridService.fillPixel(pixel.x, pixel.y, 'white');
    });
  }

  escala() {
    console.log(this.transformacoes);

    if (this.gridObject) {
      let obj = this.gridObject;

      let p0 = obj[0];
      let pf = obj[obj.length - 1];

      console.log(p0, pf);

      if (this.transformacoes.x != null && this.transformacoes.x != 0) {
        p0.x = p0.x * this.transformacoes.x;
        pf.x = pf.x * this.transformacoes.x;
      }

      if (this.transformacoes.y != null && this.transformacoes.y != 0) {
        p0.y = p0.y * this.transformacoes.y;
        pf.y = pf.y * this.transformacoes.y;
      }

      for (let x = 0; x < 70; x++) {
        for (let y = 0; y < 70; y++) {
          this.gridService.clearPixel(x, y);
        }
      }

      if (this.drawType === 'dda') {
        this.dda(p0.x, p0.y, pf.x, pf.y);
      } else if (this.drawType === 'bresenham') {
        this.lineBresenham(p0.x, p0.y, pf.x, pf.y);
      } else if (this.drawType === 'circle') {
        this.circleBresenham(p0.x, p0.y, pf.x, pf.y);
      }
    }
  }

  rotacao() {
    console.log(this.transformacoes);
    let ang = (this.transformacoes.r * 180) / Math.PI;

    if (this.gridObject) {
      console.log('entrei');

      let obj = this.gridObject;

      let p0 = obj[0];
      let pf = obj[obj.length - 1];

      console.log(p0, pf);

      let origem1 = { x: p0.x - p0.x, y: p0.y - p0.y };
      let origem2 = { x: pf.x - p0.x, y: pf.y - p0.y };

      let p0xAux = origem1.x * Math.cos(ang) - origem1.y * Math.sin(ang);
      let p0yAux = origem1.x * Math.sin(ang) + origem1.y * Math.cos(ang);
      p0.x = Math.round(p0xAux + p0.x);
      p0.y = Math.round(p0yAux = p0.y);

      let pfxAux = pf.x * Math.cos(ang) - pf.y * Math.sin(ang);
      let pfyAux = pf.x * Math.sin(ang) + pf.y * Math.cos(ang);
      pf.x = Math.round(pfxAux);
      pf.y = Math.round(pfyAux);

      console.log(p0, pf);

      for (let x = 0; x < 70; x++) {
        for (let y = 0; y < 70; y++) {
          this.gridService.clearPixel(x, y);
        }
      }

      if (this.drawType === 'dda') {
        this.dda(p0.x, p0.y, pf.x, pf.y);
      } else if (this.drawType === 'bresenham') {
        this.lineBresenham(p0.x, p0.y, pf.x, pf.y);
      } else if (this.drawType === 'circle') {
        this.circleBresenham(p0.x, p0.y, pf.x, pf.y);
      }
    }
  }

  setNumPixels() {
    if (
      this.buttonSelected === 'retasDDA' ||
      this.buttonSelected === 'retasBresenham' ||
      this.buttonSelected === 'circuloBresenham'
    ) {
      this.numPixels = 2;
    } else if (this.buttonSelected === 'translacao') {
      this.numPixels = 0;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMouseDown(pixel: Pixel) {
    console.log('Pixel clicado:', pixel);

    if (this.enableGrid && this.numPixels > 0) {
      this.fillPixel(pixel.x, pixel.y);
      this.numPixels--;
    }

    if (this.numPixels == 0) {
      if (this.buttonSelected == 'retasDDA') {
        this.dda(
          this.paintedPixels[0].x,
          this.paintedPixels[0].y,
          this.paintedPixels[1].x,
          this.paintedPixels[1].y
        );
      } else if (this.buttonSelected == 'retasBresenham') {
        this.lineBresenham(
          this.paintedPixels[0].x,
          this.paintedPixels[0].y,
          this.paintedPixels[1].x,
          this.paintedPixels[1].y
        );
      } else if (this.buttonSelected == 'circuloBresenham') {
        this.circleBresenham(
          this.paintedPixels[0].x,
          this.paintedPixels[0].y,
          this.paintedPixels[1].x,
          this.paintedPixels[1].y
        );
      }
      this.paintedPixels = [];
      this.enableGrid = false;
    }

    console.log('Objeto no grid:', this.gridObject);
  }

  onContextMenu(pixel: Pixel) {
    this.gridService.clearPixel(pixel.x, pixel.y);
  }

  private fillPixel(x: number, y: number) {
    this.paintedPixels.push({ x: x, y: y });
    console.log('x0 e y0:', this.paintedPixels);

    this.gridService.fillPixel(x, y, this.pixelColor);
  }

  dda(x0: number, y0: number, x1: number, y1: number) {
    this.drawType = 'dda';
    let deltaX = x1 - x0;
    let deltaY = y1 - y0;

    let steps =
      Math.abs(deltaX) > Math.abs(deltaY) ? Math.abs(deltaX) : Math.abs(deltaY);

    let xInc = deltaX / steps;
    let yInc = deltaY / steps;

    let x = x0;
    let y = y0;

    for (let i = 0; i <= steps; i++) {
      this.gridService.fillPixel(Math.round(x), Math.round(y), 'white');
      this.objPixels.push({ x: Math.round(x), y: Math.round(y) });
      x += xInc;
      y += yInc;
    }

    this.gridObject = this.objPixels;
    this.objPixels = [];
  }

  lineBresenham(x0: number, y0: number, x1: number, y1: number) {
    this.drawType = 'bresenham';
    let deltaX = x1 - x0;
    let deltaY = y1 - y0;

    let x = x0;
    let y = y0;

    const absdx = Math.abs(deltaX);
    const absdy = Math.abs(deltaY);

    this.gridService.fillPixel(x, y, 'white');
    this.objPixels.push({ x: x, y: y });

    // coefieciente angular < 1
    if (absdx > absdy) {
      let d = 2 * absdy - absdx;

      for (let i = 0; i < absdx; i++) {
        x = deltaX < 0 ? x - 1 : x + 1;
        if (d < 0) {
          d = d + 2 * absdy;
        } else {
          y = deltaY < 0 ? y - 1 : y + 1;
          d = d + (2 * absdy - 2 * absdx);
        }
        this.gridService.fillPixel(x, y, 'white');
        this.objPixels.push({ x: x, y: y });
      }
    } else {
      // coeficiente >= 1
      let d = 2 * absdx - absdy;

      for (let i = 0; i < absdy; i++) {
        y = deltaY < 0 ? y - 1 : y + 1;
        if (d < 0) d = d + 2 * absdx;
        else {
          x = deltaX < 0 ? x - 1 : x + 1;
          d = d + 2 * absdx - 2 * absdy;
        }
        this.gridService.fillPixel(x, y, 'white');
        this.objPixels.push({ x: x, y: y });
      }
    }
    this.gridObject = this.objPixels;
    this.objPixels = [];
  }

  drawCircle(xc: any, yc: any, x: any, y: any) {
    this.gridService.fillPixel(xc + x, yc + y, 'white');
    this.objPixels.push({ x: xc + x, y: yc + y });

    this.gridService.fillPixel(xc - x, yc + y, 'white');
    this.objPixels.push({ x: xc - x, y: yc + y });

    this.gridService.fillPixel(xc + x, yc - y, 'white');
    this.objPixels.push({ x: xc + x, y: yc - y });

    this.gridService.fillPixel(xc - x, yc - y, 'white');
    this.objPixels.push({ x: xc - x, y: yc - y });

    this.gridService.fillPixel(xc + y, yc + x, 'white');
    this.objPixels.push({ x: xc + y, y: yc + x });

    this.gridService.fillPixel(xc - y, yc + x, 'white');
    this.objPixels.push({ x: xc - y, y: yc + x });

    this.gridService.fillPixel(xc + y, yc - x, 'white');
    this.objPixels.push({ x: xc + y, y: yc - x });

    this.gridService.fillPixel(xc - y, yc - x, 'white');
    this.objPixels.push({ x: xc - y, y: yc - x });
  }

  calculateRadius(x1: number, y1: number, x2: number, y2: number) {
    return Math.ceil(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
  }

  circleBresenham(x0: number, y0: number, x1: number, y1: number) {
    this.drawType = 'circle';
    let xc = x0;
    let yc = y0;

    let raio = this.calculateRadius(xc, yc, x1, y1);
    this.gridService.clearPixel(x1, y1);

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
    this.gridObject = this.objPixels;
    this.gridService.clearPixel(xc, yc);
    this.objPixels = [];
  }

  cleanCanvas() {
    for (let x = 0; x < 70; x++) {
      for (let y = 0; y < 70; y++) {
        this.gridService.clearPixel(x, y);
      }
    }
    this.paintedPixels = [];
    this.gridObject = null;
    this.setNumPixels();
    this.enableGrid = true;
  }
}
