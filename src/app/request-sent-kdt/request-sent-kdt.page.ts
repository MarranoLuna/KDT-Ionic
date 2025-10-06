import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular'; 
import { RouterModule } from '@angular/router';
import { 
  LoadingController
} from '@ionic/angular';
import { UserService } from '../services/user';

@Component({
  selector: 'app-request-sent-kdt',
  templateUrl: './request-sent-kdt.page.html',
  styleUrls: ['./request-sent-kdt.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule, FormsModule]
})
export class RequestSentKdtPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


