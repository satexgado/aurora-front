import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { CrudService } from 'src/app/dashboard/shareddash/services/crud.service';

@Component({
  selector: 'app-basevueun',
  templateUrl: './basevueun.component.html',
  styleUrls: ['./basevueun.component.scss']
})
export class BasevueunComponent implements OnInit {
  @Input() urlstructure:any;
  @Input() urlnature:any;
  @Input() urltype:any;
  @Input() urlstatut:any;
  @Input('urlstructure') set myurlstruct($url:any){
    this.urlstructure=$url;
    this.showvu('carte');
    this.getDependance(this.urlstructure,'structure');
  }
  color:any=['#2980B9', '#2E86C1', '#1F618D', '#21618C', '#154360', '#7FB3D5'];

  // @ViewChild("chart") chart: ChartComponent;
  public chartOptions: any;
  public chartOptions2: any;
  public chartOptions3:any;
  public chartOptions4:any;
  public chartOptions5:any;
  courrier:any;
  loardstatut:boolean=false;
  serie:any;
  categorie:any;
  affichecarte:any;
  affichepropo:any;
  affichecomp:any;
  affichetend:any;
  currentvalue:any;

  constructor(public crud:CrudService) { }

  ngOnInit(): void {
  }
  getDependance($url:any,$name:any){
    this.loardstatut=false;
    this.courrier=undefined;
    this.currentvalue=$name;
    this.crud.get($url).subscribe((data)=>{
      this.courrier=data;
      if(this.courrier[0]){
        this.loardstatut=true;
        this.getTreemap();
      }
    });
  }


  getTreemap(){
    this.serie=[];
    this.serie.push({'data':[]});
    var quantite="Quantité";
    this.categorie={name:[],value:[]};

    for(let item of this.courrier){
      this.serie[0].data.push({x:item.libelle,y:item.cr_courriers.length});
      this.categorie.name.push(item.libelle);
      this.categorie.value.push(item.cr_courriers.length);
    }
          //Treemap
          this.chartOptions4={
            series: this.serie,
              legend: {
                show: true
              },
              chart: {
                  height: 320,
                  type: 'treemap'
              },
              title: {
                  text: '',
                  align: 'center',
                  style: {
                    fontSize: '30px',
                    color: ''
                  },
              },
              colors:this.color,
              plotOptions: {
                treemap: {
                    distributed: true,
                    enableShades: false
                }
              }
          }

          //Bar
          this.chartOptions3={
              series: [
                {
                  name:quantite,
                  data: this.categorie.value
                }
              ],
              chart: {
                  type: "bar",
                  height: 320,
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
          //Tendance
          this.chartOptions2={
            series:[
              {
                  name:quantite,
                  data: this.serie[0].data
              }
              ],
            legend: {
                show: false
            },
            chart: {
                height: 320,
                type: 'area',
                // width:'100%'
            },
            title: {
                text: '',
                align: 'center'
            },
            colors:this.color,
            plotOptions: {
                treemap: {
                    distributed: true,
                    enableShades: false
                }
            }
          }
          //Donnut
          this.chartOptions={
            series: this.categorie.value,
            chart: {
                type: "donut",
                width: 800,
                height: 320,
                toolbar: {
                  show: true
                }
            },
            labels: this.categorie.name,
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
  resetshow(){
    this.affichecarte=undefined;
    this.affichepropo=undefined;
    this.affichecomp=undefined;
    this.affichetend=undefined;
  }
  showvu($name:any){
      this.resetshow();
      if($name=='carte'){
        this.affichecarte='ok';
      }
      if($name=='propo'){
        this.affichepropo='ok';
      }
      if($name=='compo'){
        this.affichecomp='ok';
      }
      if($name=='tend'){
        this.affichetend='ok';
      }
  }



}
