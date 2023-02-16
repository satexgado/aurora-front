import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent implements OnInit {
  @Input() img;
  @Input('img') set myimg($img){
    this.img=$img;
  }
  @Input() text1;
  @Input('text1') set mytext1($text1){
    this.text1=$text1;
  }
  @Input() text2;
  @Input('text2') set mytext2($text2){
    this.text2=$text2;
  }


  constructor() { }

  ngOnInit(): void {
  }

}
