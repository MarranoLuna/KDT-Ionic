import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {   } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-be-kdt',
  templateUrl: './be-kdt.page.html',
  styleUrls: ['./be-kdt.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonicModule, RouterLink
  ], 
})
export class BeKDTPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
