import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router'; // Necesario para [routerLink]
import { Preferences } from '@capacitor/preferences'; // Para leer datos guardados

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule] // Importamos RouterModule
})
export class MenuComponent implements OnInit {

  // Variable pública para guardar el rol ('user' o 'kdt')
  public userRole: string | null = null;

  constructor(private navController: NavController) { }

  // Usamos ngOnInit para cargar el rol una vez al inicio
  async ngOnInit() {
    await this.loadUserRole();
  }

  // ionViewWillEnter sigue siendo útil si el rol pudiera cambiar sin recargar la app
  ionViewWillEnter() {
    this.loadUserRole(); // Llama de nuevo por si acaso
  }

  async loadUserRole() {
    const { value } = await Preferences.get({ key: 'userRole' });
    this.userRole = value ? value.toLowerCase() : null;
    console.log('Rol cargado en el menú:', this.userRole);
  }

  async logout() {
    await Preferences.remove({ key: 'authToken' });
    await Preferences.remove({ key: 'userRole' });
    await Preferences.remove({ key: 'user' });
    this.navController.navigateRoot('/login');
  }
}