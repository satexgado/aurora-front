import { MpMarcheFactory } from 'src/app/core/services/marche-public/marche.model';
import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-marche-analyse',
  templateUrl: 'analyse.component.html',
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})

export class MarcheAnalyseComponent implements OnInit {
  loading= true;
  searchTerm: string;
  data;
  marche: any;
  procedure: any;
  bardata: any;
  bardata2: any;

  public chartOptions: any;
  public chartOptions2: any;
  public chartOptions3: any;
  public chartOptions4: any;

  constructor() { }

  ngOnInit() {
    const something = new MpMarcheFactory();
    something.analyses().subscribe
    (data=> {
      this.data = data;
      this.loading = false;
      this.marche={name:[],value:[]};
      this.procedure = {name:[],value:[]};
      this.bardata = {name:[],value:[]};
      this.bardata2 = {name:[],value:[]};


      for(let item of this.data.chart_type_marche){
        this.marche.name.push(item.type_marche);
        this.marche.value.push(parseInt(item.pourcentage_marche));
      }

      for(let item of this.data.chart_procedure_marche){
        this.procedure.name.push(item.type_marche);
        this.procedure.value.push(parseInt(item.pourcentage_marche));
      }

      for(let item of this.data.histogramme_prix){
        this.bardata.name.push(item.new_date);
        this.bardata.value.push(parseInt(item.data));
      }

      for(let item of this.data.histogramme_count){
        this.bardata2.name.push(item.new_date);
        this.bardata2.value.push(parseInt(item.data));
      }

      this.chartOptions={
        series: this.procedure.value,
        chart: {
            type: "pie",
            height: 380,
            toolbar: {
              show: true
            }
        },
        labels: this.procedure.name,
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
      this.chartOptions2={
        series: this.marche.value,
        chart: {
            type: "pie",
            height: 380,
            toolbar: {
              show: true
            }
        },
        labels: this.marche.name,
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
      };
      this.chartOptions3 = {
        series: [
          {
            name: "Marche",
            data: this.bardata.value
          }
        ],
        chart: {
          height: 350,
          type: "bar"
        },
        title: {
          text: "My First Angular Chart"
        },
        xaxis: {
          categories: this.bardata.name
        }
      };
      this.chartOptions4 = {
        series: [
          {
            name: "Marche",
            data: this.bardata2.value
          }
        ],
        chart: {
          height: 350,
          type: "bar"
        },
        title: {
          text: "My First Angular Chart"
        },
        xaxis: {
          categories: this.bardata2.name
        }
      };
    });
   }
}
