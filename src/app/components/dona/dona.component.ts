import { Component, Input } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: ``
})
export class DonaComponent {

  @Input() title = "Sin título"
  @Input() configDona: ChartData<'doughnut'> = {
    labels: ['Dona Vacía'],
    datasets: [{
      data: [100] ,
      backgroundColor: ['#FF0000']
    }]
  }
 
}
