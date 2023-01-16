import { Result } from './../../dashboard.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chart-configuration',
  template: ''
})
export class ChartConfigurationComponent  {
  chartConfig: {labels: string[]};
  data$ : Observable<Result[]>;

  groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

}
