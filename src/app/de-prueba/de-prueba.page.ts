import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-de-prueba',
  templateUrl: './de-prueba.page.html',
  styleUrls: ['./de-prueba.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DePruebaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
