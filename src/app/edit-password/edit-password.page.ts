import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonTitle, IonToolbar, IonHeader,
  IonGrid, 
  IonRow,  
  IonCol, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle,
  IonBackButton,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonLabel
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.page.html',
  styleUrls: ['./edit-password.page.scss'],
  standalone: true,
  imports: [
  CommonModule, 
  FormsModule, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons,
  IonBackButton,
  IonGrid, 
  IonRow,  
  IonCol, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonLabel
]
})
export class EditPasswordPage implements OnInit {

  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  // Inyectamos solo el Router, ya no necesitamos los controladores
  constructor(private router: Router) { }

  ngOnInit() { }

  changePassword() {
    // 1. Validación: Campos vacíos
    if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
      alert('Por favor, rellena todos los campos.'); 
      return;
    }

    // 2. Validación: Contraseñas no coinciden
    if (this.newPassword !== this.confirmNewPassword) {
      alert('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

   
    
    console.log('Cambiando contraseña...');
    
    // Simulas el éxito
    const success = true; 

    if (success) {
      alert('¡Contraseña actualizada con éxito!'); 
      this.router.navigate(['/home']);
    } else {
      alert('La contraseña actual es incorrecta.');
    }
  }
}


