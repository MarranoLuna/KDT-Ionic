import { Component, OnInit,ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,NgForm  } from '@angular/forms';
import { IonicModule,AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 
import { Router } from '@angular/router';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ApiService } from 'src/app/services/api';
import { UserService } from 'src/app/services/user';



@Component({
  selector: 'app-kdt-form',
  templateUrl: './kdt-form.page.html',
  styleUrls: ['./kdt-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule] 
})
export class KdtFormPage implements OnInit {

  @ViewChild('kdtForm') myForm!: NgForm;
  frontDniImage: string | null = null;
  backDniImage: string | null = null;

  formData = {
    dni: ''
  };

  constructor(private router: Router,
    private alertController: AlertController,
    private apiService: ApiService,
    private userService: UserService) { }

  ngOnInit() {
  }


  async selectFrontDni() {
    console.log('abriendo camara');
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, 
        promptLabelHeader: 'Seleccionar Foto',
        promptLabelPhoto: 'Elegir de la galería',
        promptLabelPicture: 'Tomar foto con la cámara'
      });

      if (image.dataUrl) {
        this.frontDniImage = image.dataUrl;
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen frontal', error);
    }
  }


  async selectBackDni() {
    console.log('abriendo camara');
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Seleccionar Foto',
        promptLabelPhoto: 'Elegir de la galería',
        promptLabelPicture: 'Tomar foto con la cámara'
      });

      if (image.dataUrl) {
        this.backDniImage = image.dataUrl;
      }
      
    } catch (error) {
      console.error('Error al seleccionar la imagen dorsal', error);
    }
  }


async submitForm() {
    if (this.myForm.invalid) { 
        this.myForm.control.markAllAsTouched(); 
        return; 
    }

    const dataParaEnviar = { 
      dni: String(this.formData.dni),
      dni_frente_base64: this.frontDniImage,
      dni_dorso_base64: this.backDniImage
    };

    this.apiService.registerCourier(dataParaEnviar).subscribe({ 
      next: async (response) => { 
      
        if (response.courier && response.courier.id) {
          
          await this.userService.setCourierId(response.courier.id);

          const user = await this.userService.getCurrentUser();
          if (user) {
            user.courier = response.courier; 
            await this.userService.saveUser(user); 
          }
          
          this.router.navigateByUrl('/kdt-form2');

        } 
      },
      error: (err) => { /* ... manejo de error ... */ }
    });
}
}

defineCustomElements(window);