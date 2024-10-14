import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ThemeUtils } from '../../utils/themes.utils';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent implements OnInit{

  @Input() title? = 'Cargando...'
  @Input() text? = 'Espere mientras se realiza la operación'

  ngOnInit(): void {
    const themeUrl = localStorage.getItem('theme')?.split('/');

    let spinnerColor = '';

    if (themeUrl){
      const theme = themeUrl[themeUrl.length - 1]
      switch (theme.split('.')[0]) {
        case ThemeUtils.BLUE:
        case ThemeUtils.BLUE_DARK:
          spinnerColor = '#4782f6';
          break;

        case ThemeUtils.GREEN:
        case ThemeUtils.GREEN_DARK:
          spinnerColor = '#20e2ad';
          break;

        case ThemeUtils.RED:
        case ThemeUtils.RED_DARK:
          spinnerColor = '#ed5552';
          break;

        case ThemeUtils.PURPLE:
        case ThemeUtils.PURPLE_DARK:
          spinnerColor = '#7951ed';
          break;

        case ThemeUtils.DEFAULT:
        case ThemeUtils.DEFAULT_DARK:
          spinnerColor = '#9aaab4';
          break;

        case ThemeUtils.MEGNA:
        case ThemeUtils.MEGNA_DARK:
          spinnerColor = '#5cbed7';
          break;

        default:
          spinnerColor = '#000';
          break;
      }
    } else {
      spinnerColor = '#000'
    }

    document.documentElement.style.setProperty('--spinner-border-color', spinnerColor);
  }
}
