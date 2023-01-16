import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/dashboard/shareddash/services/crud.service';

@Component({
  selector: 'app-courrier-home-ui',
  templateUrl: 'home.component.html',
})

export class CourrierUiHomeComponent implements OnInit {

    datadash:any;
    serie:any=[];
    isLoading = true;

  public chartOptions4: any;

  constructor(
    public crud:CrudService
  ) { }

  ngOnInit(): void {
    this.getData();
  }
  getData(){
    this.crud.get('sumaccueildash').subscribe((data)=>{
      this.datadash=data;
      this.getTreemap();
      this.isLoading = false;
    });
  }
  getTreemap(){
    this.serie=[];
    this.serie.push({'data':[]});
    if(this.datadash.structure.length>0){
      for(let item of this.datadash.structure){
         this.serie[0].data.push({x:item.cigle,y:item.cr_courriers.length, z:item.libelle});
      }
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
          colors: [
            '#2980B9', '#2E86C1', '#1F618D', '#21618C', '#154360', '#7FB3D5'
          ],
          tooltip: {
            z: {
                formatter: undefined,
                title: ''
            },
          },
          plotOptions: {
            treemap: {
                distributed: true,
                enableShades: false
            }
          }
      }
      this.crud.console();
    }

  }
}
