import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user';
import { Global } from '../services/global';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

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
        private userService: UserService,
        private router: Router,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private global: Global
    ) {
        this.global.verifyLogin(); // Verifica si el usuario inicio sesión y se guardó un token
    }


    async onLogin() {
       
        const loading = await this.loadingCtrl.create({
            message: 'Iniciando sesión...',
            spinner: 'crescent'
        });
        await loading.present();

        
        this.userService.login(this.credentials).subscribe({
            
            next: async (response: any) => {
                console.log('Login exitoso, respuesta completa:', response);
                await loading.dismiss();

                try { 
                    this.userService.saveUser(response.user); 
                    await Preferences.set({ key: 'authToken', value: response.token });

                    // Obtiene y guarda el rol
                    const roleNameToSave = response.user?.role?.name; 
                    //console.log('Valor del rol ANTES de guardar:', roleNameToSave); 

                    if (roleNameToSave) {
                        await Preferences.set({ key: 'userRole', value: roleNameToSave });
                        //console.log('Rol guardado en Preferences.'); 

                        await Preferences.set({ key: 'user', value: JSON.stringify(response.user) });

                        const userRole = roleNameToSave.toLowerCase();
                        if (userRole === 'kdt') {
                            this.router.navigate(['/kdt-home']);
                        } else {
                            this.router.navigate(['/home']);
                        }
                    } else {
                        
                        console.error('ERROR: No se encontró el nombre del rol en la respuesta!');
                        this.showToast('Error al procesar la respuesta del servidor.', 'danger');
                    }
                } catch (e) {
                    
                    console.error('Error al guardar datos en Preferences:', e);
                    this.showToast('Error al guardar la sesión.', 'danger');
                }
            },
            
            error: async (error: HttpErrorResponse) => {
                await loading.dismiss();
                this.showToast('Usuario o contraseña incorrectos ❌', 'danger');
            }
        });
    } 

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    private async showToast(message: string, color: 'success' | 'danger') {
        const toast = await this.toastCtrl.create({
            message,
            duration: 3000,
            position: 'top',
            color
        });
        await toast.present();
    }
} 