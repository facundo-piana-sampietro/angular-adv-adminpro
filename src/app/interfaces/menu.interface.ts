export interface MenuItem {
  titulo: string;
  icono: string;
  submenu: SubMenuItem[];
}

export interface SubMenuItem {
  titulo: string;
  url: string;
}

