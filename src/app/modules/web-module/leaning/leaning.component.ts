import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { GeminiService } from 'src/app/services/gemini/gemini.service';

@Component({
  selector: 'app-leaning',
  templateUrl: './leaning.component.html',
  styleUrls: ['./leaning.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class LeaningComponent  implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  userId!: any;
  moduleList: any[] = [];

  constructor(private geminiService: GeminiService, private router: Router) { }

  ngOnInit() {
    this.userId = sessionStorage.getItem("userId");
    this.loadModuleList();
  }

  onClickModule(moduleId: any) {
    this.router.navigate(['inside-module', moduleId]);
  }

  loadModuleList() {
    this.geminiService.getAllGeneratedModules(this.userId).subscribe((resp: any) => {
      if (resp.code === 1) {
        const dataList = JSON.parse(JSON.stringify(resp));

        dataList.content.forEach((el: any) => {
          this.moduleList.push(el);
        })
      } else {
        
      }
    })
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }


}
