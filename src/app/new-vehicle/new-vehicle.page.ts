import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-vehicle',
  templateUrl: './new-vehicle.page.html',
  styleUrls: ['./new-vehicle.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NewVehiclePage implements OnInit {

  constructor(
    private router : Router
  ) { }

  ngOnInit() {
  }

  register_bike() {
    this.router.navigate(['/register-bicycle'], {
      state: { coming_from: 'new_vehicle' } // envía un objeto que dice de donde llega el user
    });

  }

  register_motorcycle() {
    this.router.navigate(['/register-motorcycle'], {
      state: { coming_from: 'new_vehicle' }
    });
  }

}
