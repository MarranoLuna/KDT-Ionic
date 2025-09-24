import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api';
import { Preferences } from '@capacitor/preferences';

import {
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
  IonButton
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
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
    RouterLink
  ]
})
export class MenuComponent {

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  async onLogout() {
    this.apiService.logout();
  }
}
