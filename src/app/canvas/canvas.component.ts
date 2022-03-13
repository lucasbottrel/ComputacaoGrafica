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

  enableGrid: boolean = false;
  buttonSelected: string = '';
  transformacoes: any;
  centerPixel = { x: 35, y: 35 };
  width: number = 500;
  height: number = 500;
  pixelSize = 7;
  numPixels: number = 0;
  paintedPixels: any = [];
  paintedPixelsClip: any = [];
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @Input('buttonSelected')
  set BUTTONSELECTED(buttonSelected: any) {
    this.buttonSelected = buttonSelected;
    this.setNumPixels();
  }

  @Input('transformacoes')
  set TRANSFORMACOES(transformacoes: any) {
    this.transformacoes = transformacoes;

    if (this.buttonSelected === 'translacao') this.translacao();
    else if (this.buttonSelected === 'rotacao') this.rotacao();
    else if (this.buttonSelected === 'escala') this.escala();
    else if (this.buttonSelected === 'reflexao') this.reflexao();
  }

  setNumPixels() {
    if (
      (this.buttonSelected === 'retasDDA' ||
        this.buttonSelected === 'retasBresenham' ||
        this.buttonSelected === 'circuloBresenham') &&
      this.gridObject.length == 0
    ) {
      this.pixelColor = 'orange';
      this.enableGrid = true;
      this.numPixels = 2;
    } else if (
      this.gridObject.length > 0 &&
      (this.buttonSelected === 'liangBarsky' ||
        this.buttonSelected === 'cohenSutherland')
    ) {
      this.pixelColor = 'green';
      this.enableGrid = true;
      this.numPixels = 2;
    }
  }

  onMouseDown(pixel: Pixel) {

    if (this.enableGrid && this.numPixels > 0) {
      this.fillPixel(pixel.x, pixel.y);
      this.numPixels--;
    }

    if (this.numPixels == 0 && this.enableGrid) {
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
      } else if (this.buttonSelected == 'cohenSutherland') {
        this.cohenSutherland();
      } else if (this.buttonSelected == 'liangBarsky') {
        this.liangBarsky();
      }

      this.enableGrid = false;
      this.paintedPixels = [];
    }

  }

  onContextMenu(pixel: Pixel) {
    this.gridService.clearPixel(pixel.x, pixel.y);
  }

  private fillPixel(x: number, y: number) {
    this.paintedPixels.push({ x: x, y: y });

    this.gridService.fillPixel(x, y, this.pixelColor);
  }

  //------------------ DESENHOS --------------------------
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

  //------------------ TRANSFORMAÇÕES GEOMETRICAS --------------------------
  translacao() {
    let newGridObject: any;

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

    if (this.gridObject) {
      let obj = this.gridObject;

      let p0_orig = obj[0];
      let pf_orig = obj[obj.length - 1];

      let p0 = { x: 0, y: 0 };
      let pf = { x: pf_orig.x - p0_orig.x, y: pf_orig.y - p0_orig.y };

      if (this.transformacoes.x != null && this.transformacoes.x != 0) {
        p0.x = p0.x * this.transformacoes.x;
        pf.x = pf.x * this.transformacoes.x;
      }

      if (this.transformacoes.y != null && this.transformacoes.y != 0) {
        p0.y = p0.y * this.transformacoes.y;
        pf.y = pf.y * this.transformacoes.y;
      }

      p0 = { x: p0.x + p0_orig.x, y: p0.y + p0_orig.y };
      pf = { x: pf.x + p0_orig.x, y: pf.y + p0_orig.y };

      this.redraw(p0, pf);
    }
  }

  rotacao() {

    let ang = -(this.transformacoes.r * Math.PI) / 180;

    if (this.gridObject) {
      let obj = this.gridObject;

      let p0_orig = obj[0];
      let pf_orig = obj[obj.length - 1];

      let p0 = { x: 0, y: 0 };
      let pf = { x: pf_orig.x - p0_orig.x, y: pf_orig.y - p0_orig.y };

      let p0xAux = p0.x * Math.cos(ang) - p0.y * Math.sin(ang);
      let p0yAux = p0.x * Math.sin(ang) + p0.y * Math.cos(ang);
      p0.x = Math.round(p0xAux);
      p0.y = Math.round(p0yAux);

      let pfxAux = pf.x * Math.cos(ang) - pf.y * Math.sin(ang);
      let pfyAux = pf.x * Math.sin(ang) + pf.y * Math.cos(ang);
      pf.x = Math.round(pfxAux);
      pf.y = Math.round(pfyAux);

      p0 = { x: p0.x + p0_orig.x, y: p0.y + p0_orig.y };
      pf = { x: pf.x + p0_orig.x, y: pf.y + p0_orig.y };

      this.redraw(p0, pf);
    }
  }

  reflexaoX(p0: any, pf: any, desl_p0: any, desl_pf: any) {
    if (p0.y < this.centerPixel.y) p0.y = p0.y + 2 * desl_p0.y;
    else p0.y = p0.y - 2 * desl_p0.y;

    if (pf.y < this.centerPixel.y) pf.y = pf.y + 2 * desl_pf.y;
    else pf.y = pf.y - 2 * desl_pf.y;
  }

  reflexaoY(p0: any, pf: any, desl_p0: any, desl_pf: any) {
    if (p0.x < this.centerPixel.x) p0.x = p0.x + 2 * desl_p0.x;
    else p0.x = p0.x - 2 * desl_p0.x;

    if (pf.x < this.centerPixel.x) pf.x = pf.x + 2 * desl_pf.x;
    else pf.x = pf.x - 2 * desl_pf.x;
  }

  reflexao() {
    let obj = this.gridObject;

    let p0 = obj[0];
    let pf = obj[obj.length - 1];

    let desl_p0 = {
      x: Math.abs(p0.x - this.centerPixel.x),
      y: Math.abs(p0.y - this.centerPixel.y),
    };
    let desl_pf = {
      x: Math.abs(pf.x - this.centerPixel.x),
      y: Math.abs(pf.y - this.centerPixel.y),
    };

    if (this.transformacoes.reflexao == 'x')
      this.reflexaoX(p0, pf, desl_p0, desl_pf);
    else if (this.transformacoes.reflexao == 'y')
      this.reflexaoY(p0, pf, desl_p0, desl_pf);
    else if (this.transformacoes.reflexao == 'xy') {
      this.reflexaoX(p0, pf, desl_p0, desl_pf);
      this.reflexaoY(p0, pf, desl_p0, desl_pf);
    }

    this.redraw(p0, pf);
  }

  //------------------ RECORTES --------------------------
  /**
   * Função para calcular o código de região para um ponto (x, y)
   * @param min_x limite minimo em x da janela
   * @param min_y limite minimo em y da janela
   * @param max_x limite maximo em x da janela
   * @param max_y limite maximo em y da janela
   * @param x x do ponto
   * @param y y do ponto
   * @returns código indicando a posição do ponto no plano
   */
  regionCode(
    min_x: number,
    min_y: number,
    max_x: number,
    max_y: number,
    x: number,
    y: number
  ) {
    
    let cod = 0; // inicializa como se estives dentro da janela - 0000

    if (x < min_x) cod += 1; // esq - seta bit 0
    if (x > max_x) cod += 2; // dir - seta bit 1
    if (y < min_y) cod += 4; // inf - seta bit 2
    if (y > max_y) cod += 8; // sup - seta bit 4

    return cod;
  }

  /**
   * Algoritmo de Cohen Sutherland para calcular o recorte
   */
  cohenSutherland() {
    
    // Definindo x_max, y_max e x_min, y_min para 
    // o retângulo de recorte.Os pontos diagonais são 
    // o suficiente para definir um retângulo
    let min_x = this.paintedPixels[0].x;
    let min_y = this.paintedPixels[0].y;
    let max_x = this.paintedPixels[1].x;
    let max_y = this.paintedPixels[1].y;

    let obj = this.gridObject;

    let x1 = obj[0].x;
    let y1 = obj[0].y;
    let x2 = obj[obj.length - 1].x;
    let y2 = obj[obj.length - 1].y;

    // Inicializa a linha como fora da janela retangular
    let aceite = false;
    let feito = false;

    // Calcular códigos de região para P1, P2
    let c1 = this.regionCode(min_x, min_y, max_x, max_y, x1, y1);
    let c2 = this.regionCode(min_x, min_y, max_x, max_y, x2, y2);

    while (!feito) {

      // Se ambos os pontos finais estiverem dentro do retângulo
      if (c1 == 0 && c2 == 0) {
        aceite = true;
        feito = true;
      
      // Se ambos os pontos finais estiverem fora do retângulo, 
      // na mesma região
      } else if ((c1 & c2) != 0) {
        feito = true;
      // Algum segmento de linha está dentro do 
      // retângulo
      } else {
        let cfora, x, y;

        // Pelo menos um ponto final está fora do 
        // retângulo, selecione-o.
        if (c1 != 0) cfora = c1;
        else cfora = c2;

        // Calcula o ponto de intersecção
        if (cfora & 8) {
          // ponto está em cima da janela
          x = x1 + ((x2 - x1) * (max_y - y1)) / (y2 - y1);
          y = max_y;
        } else if (cfora & 4) {
          // ponto está abaixo da janela
          x = x1 + ((x2 - x1) * (min_y - y1)) / (y2 - y1);
          y = min_y;
        } else if (cfora & 2) {
          // ponto está a direita da janela
          y = y1 + ((y2 - y1) * (max_x - x1)) / (x2 - x1);
          x = max_x;
        } else if (cfora & 1) {
          // ponto está a esquerda da janela
          y = y1 + ((y2 - y1) * (min_x - x1)) / (x2 - x1);
          x = min_x;
        }

        // Agora o ponto de interseção x, y é encontrado
        // Substituímos o ponto fora do retângulo
        // pelo ponto de interseção
        if (cfora == c1) {
          x1 = Math.round(x);
          y1 = Math.round(y);
          c1 = this.regionCode(min_x, min_y, max_x, max_y, x1, y1);
        } else {
          x2 = Math.round(x);
          y2 = Math.round(y);
          c2 = this.regionCode(min_x, min_y, max_x, max_y, x2, y2);
        }
      }

      // Se está na área de código 0000
      if (aceite) {
        // redesenha o objeto na área de janela
        this.redraw({ x: x1, y: y1 }, { x: x2, y: y2 });
      }
    }
  }

  /**
   * Algoritmo de Liang barsky para calcular o recorte
   */
  liangBarsky() {
    let min_x = this.paintedPixels[0].x;
    let min_y = this.paintedPixels[0].y;
    let max_x = this.paintedPixels[1].x;
    let max_y = this.paintedPixels[1].y;

    let obj = this.gridObject;

    let x1 = obj[0].x;
    let y1 = obj[0].y;
    let x2 = obj[obj.length - 1].x;
    let y2 = obj[obj.length - 1].y;

    let dx = x2 - x1;
    let dy = y2 - y1;
    let p = [-dx, dx, -dy, dy];
    let q = [x1 - min_x, max_x - x1, y1 - min_y, max_y - y1];
    let t1 = 0.0;
    let t2 = 1.0;
    let temp, xx1, yy1, xx2, yy2;

    for (let i = 0; i < 4; i++) {
      if (p[i] == 0) {
        if (q[i] >= 0) {
          if (i < 2) {
            if (y1 < min_y) y1 = min_y;
            if (y2 > max_y) y2 = max_y;
          }
          if (i > 1) {
            if (x1 < min_x) x1 = min_x;
            if (x2 > max_x) x2 = max_x;
          }
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      temp = q[i] / p[i];
      if (p[i] < 0) {
        if (t1 <= temp) t1 = temp;
      } else {
        if (t2 > temp) t2 = temp;
      }
    }

    if (t1 < t2) {
      xx1 = x1 + t1 * p[1];
      xx2 = x1 + t2 * p[1];
      yy1 = y1 + t1 * p[3];
      yy2 = y1 + t2 * p[3];
    }

    this.redraw(
      { x: Math.round(xx1), y: Math.round(yy1) },
      { x: Math.round(xx2), y: Math.round(yy2) }
    );
  }

  /**
   * Redesenha a forma de acordo com o desenho
   * @param p0 ponto inicial
   * @param pf ponto final
   */
  redraw(p0: any, pf: any) {
    
    for (let x = 0; x <= 70; x++) {
      for (let y = 0; y <= 70; y++) {
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

  /**
   * Limpa a tela
   */
  cleanCanvas() {
    for (let x = 0; x <= 70; x++) {
      for (let y = 0; y <= 70; y++) {
        this.gridService.clearPixel(x, y);
      }
    }
    this.paintedPixels = [];
    this.gridObject = [];
    this.setNumPixels();
  }
}
