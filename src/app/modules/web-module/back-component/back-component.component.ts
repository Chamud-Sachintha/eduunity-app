import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-back-component',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './back-component.component.html',
  styleUrls: ['./back-component.component.scss'],
})
export class BackComponentComponent  implements OnInit {

  @Input() backPath: string = ''; 

  constructor(private router: Router) { }

  ngOnInit() {}

  onClickGoBack() {
    this.router.navigate([this.backPath])
  }

}
