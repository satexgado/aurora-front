import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/dashboard/shareddash/services/crud.service';


@Component({
  selector: 'app-vuetrois',
  templateUrl: './vuetrois.component.html',
  styleUrls: ['./vuetrois.component.scss']
})
export class VuetroisComponent implements OnInit {
  public chartOptions: any;
  public chartOptions3:any;
  public chartOptions5:any;
  courrier:any;
  entrant=[];
  sortant=[];
  interne=[];
  domaine:any;
  mydomaine=[];
  domentrant=0;
  domaban=0;
  dominterne=0;
  domderog=0;
  mois=['Jan','Fev','Mars','Avr','Juin','Jul','Aout','Sept','Oct','Nov','Dec'];
  courrierbymonth:any;
  index:any;
  color:any=['#2980B9', '#2E86C1', '#1F618D', '#21618C', '#154360', '#7FB3D5'];


  constructor(public crud:CrudService) { }

  ngOnInit(): void {
    this.getDependance();
  }
  getDependance(){
    this.courrier=undefined;
    this.crud.get('diffcrdash').subscribe((data)=>{
      this.courrier=data;
      if(this.courrier){
        this.getMulti();
      }
    });
  }
  getMulti(){
    var serie:any=[];
    var series:any=[];
    var currententrant:any=[];
    var currentsortant:any=[];
    var currentinterne:any=[];
    serie.push({'name':'entrant'});
    serie.push({'name':'sortant'});
    serie.push({'name':'interne'});
    for(const[i,item]  of this.mois.entries()){
     currententrant[i]=0;
     currentsortant[i]=0;
     currentinterne[i]=0;
    }
    //Courrier entrant
    if(this.courrier.entrant.length>0){
      for(let item of this.courrier.entrant){
        var month =new Date(item.created_at).getMonth();
        currententrant[month]+=1;
      }
    }
    //Courrier sortant
    if(this.courrier.sortant.length>0){
      for(let item of this.courrier.sortant){
        var month =new Date(item.created_at).getMonth();
         currentsortant[month]+=1;
      }
    }
    //Courrier interne
    if(this.courrier.interne.length>0){
      for(let item of this.courrier.interne){
        var month =new Date(item.created_at).getMonth();
        currentinterne[month]+=1;
      }
    }

    serie[0].type='column';
    serie[1].type='area';
    serie[2].type='line'
    serie[0].data=currententrant;
    serie[1].data=currentsortant;
    serie[2].data=currentinterne;
    series.push({'name':'entrant','data':currententrant});
    series.push({'name':'sortant','data':currentsortant});
    series.push({'name':'interne','data':currentinterne});
    this.chartOptions3 = {
      series:serie,
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset:false
           }
          }
      },
      colors:this.color,
      yaxis: [
        {
          title: {
            text: serie[0].name
          }
        },
        {
          opposite: true,
          title: {
            text: serie[1].name
          }
        }
      ],
      stroke: {
        width: [0, 4]
      },
      labels: this.mois,
      markers: {
        size: 0
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
        }
    };
    this.chartOptions5={
      series: series,
        chart: {
        type: 'bar',
        height: 290
        },
        colors:this.color,
        plotOptions: {
        bar: {
        horizontal: false,
        columnWidth: '35%',
        endingShape: 'rounded'
        },
        },
        dataLabels: {
         enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
         categories: this.mois,
        },
        yaxis: {
          title: {
          text: ''
          }
        },
        fill: {
         opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val:any) {
              return  val
            }
          }
        }
    }
    this.getId(1);
    this.crud.console();

  }
  getId($month:any,$vue?:any){
    var val;
    if($vue){
      val=$month.value;
    }
    if(!$vue){
      val=$month;
    }
    this.courrierbymonth=undefined;
    this.index=val;
    this.crud.get('diffcrbymonthdash/'+val).subscribe((data)=>{
      this.courrierbymonth=data;
      if(this.courrierbymonth){
        this.getPie();
      }
    });
  }
  getPie(){
    var serie:any=[];
    var label:any=[];
    label.push('entrant');
    label.push('sortant');
    label.push('interne');
    serie.push(this.courrierbymonth.entrant.length);
    serie.push(this.courrierbymonth.sortant.length);
    serie.push(this.courrierbymonth.interne.length);
    this.chartOptions = {
      series: serie,
      chart: {
      type: 'pie',
      height:250,
      toolbar: {
        show: true
      },
      },
      colors:this.color,
      labels: label,
      responsive: [{
      breakpoint: 480,
      options: {
      chart: {
      width: 200
      },
      legend: {
      position: 'bottom'
      },
      }
      }]
    };
     this.crud.console();
  }

}
