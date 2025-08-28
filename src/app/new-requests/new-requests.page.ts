import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonApp, IonGrid, IonLabel, IonIcon, IonCardContent, 
  IonCardTitle, IonMenuButton, IonButton, IonButtons, IonRow, IonList, IonItem, IonInput, IonToggle, IonTextarea, 
   IonModal, IonNote ,IonSelect , IonText, IonSelectOption} from '@ionic/angular/standalone';
  import { RouterLink } from '@angular/router';
 
@Component({
  selector: 'app-new-requests',
  templateUrl: './new-requests.page.html',
  styleUrls: ['./new-requests.page.scss'],
  standalone: true,
  

 

  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,  IonApp, IonGrid, IonLabel, 
    IonIcon, IonCardContent, IonCardTitle, IonMenuButton, IonButton, IonButtons, IonRow,  IonText, IonSelectOption,
    IonList, IonItem, IonInput,  IonToggle, IonTextarea, IonNote,  IonModal, IonSelect, RouterLink]
})
export class NewRequestsPage implements OnInit {

 
  mostrarParada: boolean = false;
  mostrarCantidadDinero: boolean=false;

  constructor() {}

  ngOnInit() {}

  toggleParada(event: any) {
    this.mostrarParada = event.detail.checked;
  }
  toggleDinero(event: any) {
    this.mostrarCantidadDinero = event.detail.checked;
  }
}