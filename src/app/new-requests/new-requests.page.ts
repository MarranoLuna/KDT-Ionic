import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,  IonLabel, 
   IonMenuButton, IonButton, IonButtons,  IonList, IonItem, IonInput, IonToggle, IonTextarea, 
    IonNote ,IonSelect , IonSelectOption} from '@ionic/angular/standalone';
  //import { RouterLink } from '@angular/router';
 
@Component({
  selector: 'app-new-requests',
  templateUrl: './new-requests.page.html',
  styleUrls: ['./new-requests.page.scss'],
  standalone: true,
  

 

  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,    IonLabel, 
     IonMenuButton, IonButton, IonButtons,   IonSelectOption,
    IonList, IonItem, IonInput,  IonToggle, IonTextarea, IonNote,   IonSelect]
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