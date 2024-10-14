import { Pipe, PipeTransform } from '@angular/core';
import { TipoEntidad } from '../types/tipo-entidad.type';
import { environment } from '../../environments/environment';

const base_url = environment.base_url

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string | undefined, tipo: TipoEntidad): string {

    if (!img){
      return `${base_url}/uploads/${tipo}/no-img`
    }

    if (img.includes('https')){
        return img
    }

    return `${base_url}/uploads/${tipo}/${img}`

  }

}
