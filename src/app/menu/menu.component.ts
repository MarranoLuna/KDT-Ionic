import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class MenuComponent {

  // Variable pública para guardar el rol ('user' o 'kdt')
  public userRole: string | null = null;

  constructor(private navController: NavController) {
    this.loadUserRole();
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