import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  
  canvasSize: any = Array.from(Array(20).keys())
  isPixelClicked: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.canvasSize)
    console.log(this.isPixelClicked)
  }

  onClickPixel(obj: any){    
    this.isPixelClicked = !this.isPixelClicked;
    console.log(this.isPixelClicked,obj)
  }

}
