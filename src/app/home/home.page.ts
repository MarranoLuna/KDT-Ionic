import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user';
import { Global } from 'src/app/services/global';
import { OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { UserMenuComponent } from '../components/user-menu/user-menu.component';
// CAMBIO 1: Importa la interfaz UserData
import { ApiService, UserData } from '../services/api';
import { Preferences } from '@capacitor/preferences';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [ RouterLink, UserMenuComponent, IonicModule]})

export class HomePage implements OnInit {

userName: string = '';
  // CAMBIO 2: Crea una variable para el OBJETO de usuario completo
userData: UserData | null = null;

constructor(
   private userService: UserService, 
  private global: Global,
  private apiService: ApiService,
  private loadingCtrl: LoadingController,
 ) {
  console.log("Entra al home");
 // Es mejor quitar la llamada a 'mostrarUSer()' de aquí
    // y dejar que los 'lifecycle hooks' (ngOnInit/ionViewWillEnter) se encarguen.
}

  // 'ngOnInit' se ejecuta solo la PRIMERA vez que se carga la página.
async ngOnInit() {
  console.log("ngoninit")
    await this.loadUserData();
}

  // CAMBIO 3: Añadimos 'ionViewWillEnter'
  // Esto se ejecuta CADA VEZ que entras a la página (ej: al volver de editar perfil).
  // Así nos aseguramos que el avatar esté siempre actualizado.
  async ionViewWillEnter() {
    console.log("ionviewwillenter")
  this.userData = await this.userService.getCurrentUser();
  console.log('URL del avatar:', this.userData?.avatar); // <-- AÑADE ESTO
}

  // CAMBIO 4: Creamos una función reutilizable para cargar los datos
  async loadUserData() {
    // No mostramos el 'loading' aquí para que la actualización del avatar sea silenciosa
    // Si prefieres ver el 'loading' cada vez, puedes mover el 'loadingCtrl' aquí.
    
    try {
        await this.global.verifyLogin();
        
        const currentUser = await this.userService.getCurrentUser();

        if (currentUser) {
            // ¡AQUÍ ESTÁ LA MAGIA!
            this.userData = currentUser; // Guardamos el objeto COMPLETO
            this.userName = this.userData.firstname; // Y también el nombre
        } else {
            this.userName = 'Invitado';
            this.userData = null;
        }

    } catch (error) {
        console.error('Ocurrió un error:', error);
        this.userName = 'Invitado';
        this.userData = null;
    }
  }

}