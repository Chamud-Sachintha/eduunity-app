import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BackComponentComponent } from '../back-component/back-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonicModule, BackComponentComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent  implements OnInit {

  gender = '';
  backPath = "/";

  constructor() { }

  ngOnInit() {}

}
