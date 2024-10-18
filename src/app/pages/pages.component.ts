import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

declare function customInitFunctions(): void;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: ``
})
export class PagesComponent implements OnInit{

  constructor(
    private _ss: SettingsService,
    private _sbs: SidebarService
  ){}

  ngOnInit(): void {
    customInitFunctions();
    this._sbs.cargarMenu();
  }
}
