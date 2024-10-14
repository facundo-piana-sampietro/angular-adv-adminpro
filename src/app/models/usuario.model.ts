import { environment } from "../../environments/environment.prod"

const base_url = environment.base_url
export class Usuario {

  constructor(
      public nombre: string,
      public email: string,
      public password?: string,
      public role?: string,
      public img?: string,
      public google?: boolean,
      public _id?: string
  ) {
  }

  get imagenUrl(){
    if (!this.img){
      return `${base_url}/uploads/usuarios/no-img`
    }

    if ( this.img.includes('https')){
        return this.img
    }

    if (this.img){
      return `${base_url}/uploads/usuarios/${this.img}`
    } else {
      return `${base_url}/uploads/usuarios/no-img`
    }
  }
}

