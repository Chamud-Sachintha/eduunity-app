import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Home } from 'src/app/models/Home/home';
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonicModule],
  standalone: true
})
export class HomeComponent  implements OnInit {

  homeDataList = new Home();
  userId: any;
  constructor(private router: Router, private homeService: HomeService) {}

  ngOnInit() {
    this.userId = sessionStorage.getItem("userId");
    this.loadHomeData();
  }

  loadHomeData() {
    this.homeService.loadHomeData(this.userId).subscribe((resp: any) => {
      if (resp.code === 1) {
        this.homeDataList.firstName = resp.data.student.firstName;
      } else {

      }
    })
  }

}
