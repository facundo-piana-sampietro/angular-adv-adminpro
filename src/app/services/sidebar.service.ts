import { Injectable } from '@angular/core';
import { MenuItem } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: MenuItem[] = []

  constructor() { }

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu') ?? '') ?? [];
  }
}
