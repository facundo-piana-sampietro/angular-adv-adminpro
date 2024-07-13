import { Component } from '@angular/core';
import { ChartData } from 'chart.js';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: ``
})
export class Grafica1Component {

  private labelsComida: string[] = [
    'Panchos',
    'Hamburguesas',
    'Empanadas',
  ];

  public configComidas: ChartData<'doughnut'> = {
    labels: this.labelsComida,
    datasets: [
      {
        data: [200, 150, 500] ,
        backgroundColor: ['#6857E6', '#009FEE', '#F02059']
      }
    ],    
  };

  private labelsBebidas: string[] = [
    'Manaos',
    'Cunnington',
    'Pepsi',
  ];

  public configBebidas: ChartData<'doughnut'> = {
    labels: this.labelsBebidas,
    datasets: [
      {
        data: [450, 200, 100] ,
        backgroundColor: ['#1EF91A', '#F91AF2', '#1ACAF9']
      }
    ],    
  };

  private labelsPostres: string[] = [
    'Helado',
    'Flan',
    'Tiramusú',
  ];

  public configPostres: ChartData<'doughnut'> = {
    labels: this.labelsPostres,
    datasets: [
      {
        data: [200, 150, 120] ,
        backgroundColor: ['#751AF9', '#FFB200', '#00FFB2']
      }
    ],    
  };


}
