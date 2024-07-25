import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {
  
  menuItems: any[];

  constructor( private _ss: SidebarService){
    this.menuItems = this._ss.menu  
  }

  
}
