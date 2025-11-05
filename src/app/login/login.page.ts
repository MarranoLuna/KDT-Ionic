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
        console.log("Entra al login");
        this.global.verifyLogin(); // Verifica si el usuario inicio sesión y se guardó un token
    }

    async onLogin() {
        console.log("entra a la función de login");
        
        const loading = await this.loadingCtrl.create({
            message: 'Iniciando sesión...',
            spinner: 'crescent'
        })
        
        loading.present();
        

        this.userService.login(this.credentials).subscribe({//?envia las credenciales a userService (la misma API) y recibe la respuesta
            next: async (response: any) => {
                console.log('Login exitoso, respuesta completa:', response);
                await loading.dismiss();
                try {
                    this.saveUser(response);
                    this.registerNotifications();

                } catch (e) {
                    console.error('Error al guardar datos en Preferences:', e);
                    this.global.presentToast('Error al guardar la sesión.', 'danger');
                }
            },

            error: async (error: HttpErrorResponse) => {
                await loading.dismiss();
                this.global.presentToast('Usuario o contraseña incorrectos ❌', 'danger');
            }
        });
    }

    async saveUser(response: any) { // guarda el usuario y el token en las preferencias
        await this.userService.saveUser(response.user);
        await Preferences.set({ key: 'authToken', value: response.token });
        const roleNameToSave = response.user?.role?.name; // Obtiene y guarda el rol
        if (roleNameToSave) {
            await Preferences.set({ key: 'userRole', value: roleNameToSave });
            await Preferences.set({ key: 'user', value: JSON.stringify(response.user) });
            const userRole = roleNameToSave.toLowerCase();
            if (userRole === 'kdt') {
                this.router.navigate(['/kdt-home']);
            } else {
                this.router.navigate(['/home']);
            }
        } else {
            console.error('ERROR: No se encontró el nombre del rol en la respuesta!');
            this.global.presentToast('Error al procesar la respuesta del servidor.', 'danger');
        }
    }

    async registerNotifications() { // habilita notificaciones push
        await PushNotifications.register(); // el token demora porque hay que registrar el dispositivo para recibir notificaciones push 
        PushNotifications.addListener('registration', async (token) => { // se ejecuta cuando llega el token
            console.log('🟢 Token FCM:', token.value);
            //envia datos para guardar el token de las notificaciones en la bbdd
            (await this.api.savePushNotificationsToken({push_token: token.value})).subscribe({
                next: async (response: any) =>  {
                    console.log("Se guardó el token de notificaciones");
                    console.log("Token guardado:"+response.user.push_token);
                    this.userService.saveUser(response.user);
                },
                error: async (error: HttpErrorResponse) => {
                    console.log("No se pudo registrar el dispositivo para recibir notificaciones del servidor");
                }
            });
        });
        PushNotifications.addListener('registrationError', (error) => {
            console.error('❌ Error registrando el dispositivo para recibir notificaciones:', error);
        });
    }
    togglePassword() {
        this.showPassword = !this.showPassword;
    }

} 