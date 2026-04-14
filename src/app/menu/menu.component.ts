import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { UserService } from 'src/app/services/user';
import { Router, RouterLink } from '@angular/router';

import {
  IonMenu,
  IonAvatar,
  IonContent,
  IonLabel,
  IonList,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonFooter,
  IonToolbar,
  IonButton,
  IonHeader, IonTitle,
  IonItemDivider
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
	  IonMenu,
    IonContent,
    IonAvatar,
    IonLabel,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonFooter,
    IonToolbar,
    IonButton,
    RouterLink, 
    CommonModule, 
    RouterModule, 
    IonMenu,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonList, 
    IonItem, 
    IonIcon, 
    IonLabel, 
    IonFooter, 
    IonButton, 
    IonItemDivider,
  ]
})
export class MenuComponent implements OnInit {

  public userRole: string | null = null;

  constructor(
    private navController: NavController,
    private userService: UserService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.loadUserRole();
  }

  preLoadData() {
    this.loadUserRole();
  }

  async loadUserRole() {
    const { value } = await Preferences.get({ key: 'userRole' });

    this.userRole = value ? value.toLowerCase() : null;
    console.log('Rol cargado en el menú:', this.userRole);
    return true;
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