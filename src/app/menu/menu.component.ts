import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Preferences } from '@capacitor/preferences'; 
import { UserService } from 'src/app/services/user';
import { Router } from '@angular/router';

import { 
  IonMenu,  IonHeader,  IonToolbar,  IonTitle,  IonContent, IonList, 
  IonItem,  IonIcon, IonLabel,  IonFooter,  IonButton , IonItemDivider
} from '@ionic/angular/standalone';

@Component({
 selector: 'app-menu',
 templateUrl: './menu.component.html',
 styleUrls: ['./menu.component.scss'],
 standalone: true,
 imports: [CommonModule, RouterModule,IonMenu, 
    IonHeader, IonToolbar,  IonTitle, IonContent, 
    IonList,  IonItem,  IonIcon, IonLabel,  IonFooter,   IonButton,IonItemDivider,
 ]
})
export class MenuComponent implements OnInit {

 public userRole: string | null = null;

 constructor(
    private navController: NavController, 
    private userService: UserService, 
    private router: Router
  ) { }

 async ngOnInit() {
  await this.loadUserRole();
 }

 ionViewWillEnter() {
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

  async onBecomeCourierClick() {
    const hasApplied = await this.userService.hasCourierApplication(); 
    if (hasApplied) {
      this.router.navigateByUrl('/request-sent-kdt');
    } else {
      this.router.navigateByUrl('/kdt-form');
    }
  }
}