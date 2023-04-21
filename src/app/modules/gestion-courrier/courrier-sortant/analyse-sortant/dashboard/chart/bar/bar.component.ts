import { ChartConfigurationComponent } from './../chart-configuration/chart-configuration.component';
import { Component,  AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import { ItemSelectHelper } from 'src/app/shared/state';


@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent extends ChartConfigurationComponent implements AfterViewInit {
  @ViewChild('myCanvas') myCanvas: ElementRef;
  context: CanvasRenderingContext2D;
  data: any;
  loading = true;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.loadData();
  }

  download() {
    const download = (<HTMLCanvasElement>this.myCanvas.nativeElement);
    html2canvas(download).then(function(canvas) {
        // Convert the canvas to blob
        canvas.toBlob(function(blob){
            // To download directly on browser default 'downloads' location
            let link = document.createElement("a");
            link.download = "graphique.png";
            link.href = URL.createObjectURL(blob);
            link.click();
        },'image/png');
    });
  }

  loadData() {
    this.loading = true;
    this.data$.subscribe(
      (data) => {
        this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
        let labels = [];

        if(this.chartConfig && this.chartConfig.labels)  {
          labels = this.chartConfig.labels;
        } else {
          const selectHelper = new ItemSelectHelper();
          data.forEach(element=> {
            element.data.forEach(word => selectHelper.addSelectedItem(word.libelle))
          });
          labels = selectHelper.selectedItem;
        }

        let datasets: any[] = [];
        this.data = data.forEach(element => {
          let value = [];
          labels.forEach(label=>{
            const result = element.data.filter(word => word.libelle == label);
            if(result.length) {
              value.push(result[0].data)
            } else {
              value.push(0);
            }
          });
          datasets.push({
            label: element.libelle,
            type: element.type,
            backgroundColor: element.couleur,
            borderColor: element.couleur,
            fill: false,
            data: value
          })
        });



        let myChart = new Chart(this.context, {
          type: 'bar',
          data: {
              labels: labels,
              datasets: datasets
          },
          options: {
            scales: {
                // yAxes: [{

                //   ticks: {
                //     min:0
                //   }
                // }],
              }
          }
        });
        this.loading = false;
      }
    )
  }


}
