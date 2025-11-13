import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { UserService } from 'src/app/services/user';
import { Router } from '@angular/router';

import {
  IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList,
  IonItem, IonIcon, IonLabel, IonFooter, IonButton, IonItemDivider
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-kdt-menu',
  templateUrl: './kdt-menu.component.html',
  styleUrls: ['./kdt-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonMenu,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonIcon, IonLabel, IonFooter, IonButton, IonItemDivider,
  ]
})
export class KdtMenuComponent implements OnInit {

  constructor(
    private navController: NavController,
    private userService: UserService,
    private router: Router
  ) { 
  }

  async ngOnInit() {
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