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
export class MenuComponent implements OnInit {

  // Variable pública para guardar el rol ('user' o 'kdt')
  public userRole: number | null = null;

  constructor(private navController: NavController) { }

  // cargar el rol una vez al inicio
  async ngOnInit() {
    await this.loadUserRole();
  }

  async loadUserRole() {
    const {value} = await Preferences.get({ key: 'user' });
    if(value){
      const user = JSON.parse(value);
      this.userRole = user.role_id;
    }
    console.log('Rol cargado en el menú:', this.userRole);
  }

  async logout() {
    await Preferences.remove({ key: 'authToken' });
    await Preferences.remove({ key: 'userRole' });
    await Preferences.remove({ key: 'user' });
    this.navController.navigateRoot('/login');
  }
}