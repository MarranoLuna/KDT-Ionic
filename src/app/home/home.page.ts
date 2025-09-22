import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user';
import { OnInit } from '@angular/core';
import {

  IonMenuButton, 
  IonAvatar,
  IonContent, 
  IonGrid, 
  IonRow,  
  IonCol, 
  IonCard, 

} from '@ionic/angular/standalone';

import { RouterLink } from '@angular/router';

import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonMenuButton, IonAvatar,
    IonContent, IonGrid, IonRow, IonCol, IonCard,
    RouterLink, MenuComponent
  ]
})

export class HomePage implements OnInit {

  userName: string = ''; 

  constructor(private userService: UserService) { } 

  ngOnInit() {
  
    this.userName = this.userService.getCurrentUserName();
  }

}