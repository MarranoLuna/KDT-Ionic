import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api';
import { UserService } from '../services/user';
import { Global } from '../services/global';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule
    ]
})
export class LoginPage {
    credentials = {
        email: '',
        password: ''
    };

    showPassword = false;

    constructor(
        private api: ApiService,
        private userService: UserService,
        private router: Router,
        private loadingCtrl: LoadingController,
        private global: Global
    ) {
        this.global.verifyLogin(); // Verifica si el usuario inicio sesión y se guardó un token
    }

    async onLogin() {
        
        const loading = await this.loadingCtrl.create({
            message: 'Iniciando sesión...',
            spinner: 'crescent'
        }) 
        loading.present();
        
        this.userService.login(this.credentials).subscribe({//?envia las credenciales a userService (la misma API) y recibe la respuesta
            next: async (response: any) => {
                await loading.dismiss();
                try {
                    this.registerNotifications();
                    this.saveUser(response);
                    

                } catch (e) {
                    console.error('Error al guardar datos en Preferences:', e);
                    this.global.presentToast('Error al guardar la sesión.', 'danger');
                }
            },

            error: async (error: HttpErrorResponse) => {
                await loading.dismiss();
                console.log("hubo un error");
                this.global.presentToast('Usuario o contraseña incorrectos ❌', 'danger');
            }
        });
    }

    async saveUser(response: any) { // guarda el usuario y el token en las preferencias
        await this.userService.saveUser(response.user);
        console.log(1);
        await Preferences.set({ key: 'authToken', value: response.token });
        console.log(2);
        const roleNameToSave = response.user?.role?.name; // Obtiene y guarda el rol  ->error en android studio
        console.log(3);
        if (roleNameToSave) {
            console.log(4);
            await Preferences.set({ key: 'userRole', value: roleNameToSave });
            console.log(5);
            await Preferences.set({ key: 'user', value: JSON.stringify(response.user) });
            console.log(6);
            const userRole = roleNameToSave.toLowerCase();
            console.log(7);
            if (userRole === 'kdt') {
                console.log(8);
                this.router.navigate(['/kdt-home']);
            } else {
                console.log(9);
                this.router.navigate(['/home']);
            }
        } else {
            console.log(100);
            console.error('ERROR: No se encontró el nombre del rol en la respuesta!');
            this.global.presentToast('Error al procesar la respuesta del servidor.', 'danger');
        }
    }

    async registerNotifications() { // habilita notificaciones push
        console.log(2);
        await PushNotifications.register(); // el token demora porque hay que registrar el dispositivo para recibir notificaciones push 
        console.log(22);
        PushNotifications.addListener('registration', async (token) => { // se ejecuta cuando llega el token
            console.log(23);
            console.log('🟢 Token FCM:', token.value);
            //envia datos para guardar el token de las notificaciones en la bbdd
            (await this.api.savePushNotificationsToken({push_token: token.value})).subscribe({
                next: async (response: any) =>  {
                    console.log(24);
                    console.log("Se guardó el token de notificaciones");
                    console.log("Token guardado:"+response.user.push_token);
                    this.userService.saveUser(response.user);
                    console.log(25);
                },
                error: async (error: HttpErrorResponse) => {
                    console.log(26);
                    console.log("No se pudo registrar el dispositivo para recibir notificaciones del servidor");
                }
            });
        });
        PushNotifications.addListener('registrationError', (error) => {
            console.log(27);
            console.error('❌ Error registrando el dispositivo para recibir notificaciones:', error);
        });
    }
    togglePassword() {
        console.log(30);
        this.showPassword = !this.showPassword;
    }

} 