import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: ``
})
export class AccountSettingsComponent implements OnInit {
  constructor(private _ss: SettingsService){}

  ngOnInit(): void {
    this._ss.checkCurrentTheme();
  }

  changeTheme(theme: string){
    this._ss.changeTheme(theme);
  }

}
