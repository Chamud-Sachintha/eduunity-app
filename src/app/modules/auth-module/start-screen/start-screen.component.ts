import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent  implements OnInit {

  slideIndex: number = 0;
  
  sliderText = [
    { title: "Let's keep plans and dreams", description: "Add Subjects that inspire you to your favorites. You will learn very fast." },
    { title: "Explore New Subjects", description: "Discover new Subjects and make a list of your next Roadmap." },
    { title: "Your Learn Buddy", description: "Get personalized recommendations for your Subjects and activities." }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const getTabBar = document.getElementById("testYYU");

    console.log(getTabBar)

    if (getTabBar != null) {
      getTabBar.style.display = "none";
    }
    this.showSlides();
  }

  onClickGetStart() {
    this.router.navigate(['/auth/login'])
  }

  showSlides(): void {
    const dots = document.getElementsByClassName('dot');
    this.slideIndex++;

    if (this.slideIndex > this.sliderText.length) { this.slideIndex = 1 }

    const titleElement = document.getElementById('slider-text');
    const descriptionElement = document.getElementById('slider-description');

    if (titleElement && descriptionElement) {
      titleElement.innerHTML = this.sliderText[this.slideIndex - 1].title;
      descriptionElement.innerHTML = this.sliderText[this.slideIndex - 1].description;
    }

    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }

    if (dots[this.slideIndex - 1]) {
      dots[this.slideIndex - 1].className += " active";
    }

    setTimeout(() => this.showSlides(), 3000); // Change slide every 3 seconds
  }

}
