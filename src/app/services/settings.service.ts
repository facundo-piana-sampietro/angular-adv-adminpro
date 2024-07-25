import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public linkTheme = document.querySelector('#theme');
  readonly DEFAULT_THEME = 'assets/css/colors/purple-dark.css';

  constructor() {
    const urlTheme = localStorage.getItem('theme');
    this.linkTheme?.setAttribute('href', urlTheme ?? this.DEFAULT_THEME);
  }

  changeTheme(theme: string){
    const url = `assets/css/colors/${theme}.css`;
    this.linkTheme?.setAttribute('href', url);
    localStorage.setItem('theme', url);

    this.checkCurrentTheme();
  }

  checkCurrentTheme() {
    const links = document.querySelectorAll('.selector');
    links.forEach( elem => {
      //Eliminamos cualquier clase working
      elem.classList.remove('working');
      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeUrl = `assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme?.getAttribute('href');
      
      if (btnThemeUrl == currentTheme){
        elem.classList.add('working');
      }
    })
  }

}
