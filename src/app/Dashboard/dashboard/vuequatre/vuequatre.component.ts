import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/dashboard/shareddash/services/crud.service';

@Component({
  selector: 'app-vuequatre',
  templateUrl: './vuequatre.component.html',
  styleUrls: ['./vuequatre.component.scss']
})
export class VuequatreComponent implements OnInit {
  loard:boolean=false;
  courrier:any;
  color:any=['#2980B9', '#2E86C1', '#1F618D', '#21618C', '#154360', '#7FB3D5'];
  public chartOptions: any;
  expediteur:any;


  constructor(public crud:CrudService) { }

  ngOnInit(): void {
    this.getCourrier();
  }
  getCourrier(){
    this.loard=false;
    this.courrier=undefined;
    this.crud.get('timingdash').subscribe((data)=>{
      this.courrier=data;
      if(this.courrier[0]){
        this.loard=true;
        this.getExpediteur();
      }
    });
  }
  getExpediteur(){
    this.expediteur=undefined;
    this.crud.get('expediteurdash').subscribe((data)=>{
      this.expediteur=data;
      if(this.expediteur){
        this.getChart();
      }
    });
  }
  getChart(){
      var serie:any;
      serie={name:[],value:[]};
      for(let item of this.expediteur){
        serie.name.push(item.libelle);
        serie.value.push(item.cr_courrier_entrants_count);
      }
      this.chartOptions={
        series: serie.value,
        chart: {
            type: "donut",
            height: 380,
            toolbar: {
              show: true
            }
        },
        title: {
          text: 'Expediteur',
          align: 'left'
        },
        labels: serie.name,
        colors:this.color,
        plotOptions: {
            pie: {
                donut: {
                    size: '40%'
                }
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 10
                    },
                    legend: {
                        position: "bottom"
                    }
                }
            }
        ]
      }

    this.crud.console();
  }

  getPositive(val: number) {
    return Math.abs(val);
  }

}
