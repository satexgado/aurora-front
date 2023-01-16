import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/dashboard/shareddash/services/crud.service';

@Component({
  selector: 'app-vuedeux',
  templateUrl: './vuedeux.component.html',
  styleUrls: ['./vuedeux.component.scss']
})
export class VuedeuxComponent implements OnInit {
  structure:any;
  loard:boolean=false;
  courrier:any;
  currentvalue:any;
  color:any=['#2980B9', '#2E86C1', '#1F618D', '#21618C', '#154360', '#7FB3D5'];

  // @ViewChild("chart") chart: ChartComponent;
  public chartOptions: any;
  public chartOptions2: any;
  public chartOptions3:any;
  categorie:any;
  nature:any;
  type:any;

  constructor(public crud:CrudService) { }

  ngOnInit(): void {
    this.getStructure();
  }
  getStructure(){
    this.loard=false;
    this.structure=undefined;
    this.crud.get('allstructdash').subscribe((data)=>{
      this.structure=data;
      if(this.structure.length>0){
        this.loard=true;
        this.getId(this.structure[0].id);
      }
    });
  }
  getId($id:any){
    this.currentvalue=$id;
    this.courrier=undefined;
    this.crud.get('crbystructdash/'+$id).subscribe((data)=>{
      this.courrier=data;
      this.getChart();
    });
  }
  getChart(){
    //Statut
    if(this.courrier.statut.length>0){
      this.categorie={name:[],value:[]};
      for(let item of this.courrier.statut){
        this.categorie.name.push(item.libelle);
        this.categorie.value.push(item.cr_courriers.length);
      }
      this.chartOptions3={
        series: [
          {
            name:'Quantité',
            data: this.categorie.value
          }
        ],
        chart: {
            type: "bar",
            height: 400,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "30%"
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"]
        },
        xaxis: {
            categories:this.categorie.name
        },
        yaxis: {
            title: {
                text: "$ (thousands)"
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function(val:any) {
                    return  val ;
                }
            }
        }
      }
    }
    //Nature
    if(this.courrier.nature.length>0){
      this.nature={name:[],value:[]};
      for(let item of this.courrier.nature){
        this.nature.name.push(item.libelle);
        this.nature.value.push(item.cr_courriers.length);
      }
      this.chartOptions={
        series: this.nature.value,
        chart: {
            type: "donut",
            height: 380,
            toolbar: {
              show: true
            }
        },
        labels: this.nature.name,
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
    }
    //type
    if(this.courrier.type.length>0){
      this.type={name:[],value:[]};
      for(let item of this.courrier.type){
        this.type.name.push(item.libelle);
        this.type.value.push(item.cr_courriers.length);
      }
      this.chartOptions2={
        series: this.type.value,
        chart: {
            type: "pie",
            height: 380,
            toolbar: {
              show: true
            }
        },
        labels: this.type.name,
        colors:this.color,
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
    }
    this.crud.console();
  }





}
