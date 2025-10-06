import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-validate-vehicle',
  templateUrl: './validate-vehicle.page.html',
  styleUrls: ['./validate-vehicle.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ] 


})
export class ValidateVehiclePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
