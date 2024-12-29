import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicModule, IonModal, LoadingController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { GenerateNewModuleRequest } from 'src/app/models/GenerateNewModuleRequest/generate-new-module-request';
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

  createLearningProfileForm!: FormGroup;
  generateNewModule = new GenerateNewModuleRequest();

  constructor(private geminiService: GeminiService, private router: Router, private formBuilder: FormBuilder, private alertController: AlertController
              , private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.userId = sessionStorage.getItem("userId");
    this.loadModuleList();
    this.initCreateLearningProfileForm();
  }

  async onSubmitCreateLearningProfileForm() {
    const moduleName = this.createLearningProfileForm.controls['moduleName'].value;
    const moduleLevel = this.createLearningProfileForm.controls['moduleLevel'].value;
    const isLinkWant = this.createLearningProfileForm.controls['isLinkWant'].value;

    if (moduleName == "") {
      this.presentAlert("Empty Filed Found", "Module Name is required.");
    } else if (moduleLevel == "") {
      this.presentAlert("Empty Filed Found", "Module Level is required.");
    } else {
      this.generateNewModule.moduleName = moduleName;
      this.generateNewModule.experiancedLevel = moduleLevel;
      this.generateNewModule.isYoutubeVideosWanted = isLinkWant;
      this.generateNewModule.studentId = sessionStorage.getItem("userId");

      const loading = await this.loadingCtrl.create({
        message: ' Please wait a moment',
        translucent: true
      });
  
      loading.present();

      this.geminiService.generateNewModule(this.generateNewModule).subscribe((resp: any) => {
        if (resp.code === 1) {
          this.presentAlert("generate New Module", resp.message);
        } else {
          this.presentAlert("generate New Module", resp.message);
        }
      })

      loading.dismiss();
    }
  }

  initCreateLearningProfileForm() {
    this.createLearningProfileForm = this.formBuilder.group({
      moduleName: ['', Validators.required],
      moduleLevel: ['', Validators.required],
      isLinkWant: ['', Validators.required]
    })
  }

  onClickModule(moduleId: any) {
    this.router.navigate(['inside-module', moduleId]);
  }

  async loadModuleList() {
    const loading = await this.loadingCtrl.create({
      message: ' Please wait a moment',
      translucent: true
    });

    loading.present();
    this.geminiService.getAllGeneratedModules(this.userId).subscribe((resp: any) => {
      if (resp.code === 1) {
        const dataList = JSON.parse(JSON.stringify(resp));

        dataList.content.forEach((el: any) => {
          this.moduleList.push(el);
        })
      } else {
        this.presentAlert("Get Module", resp.message);
      }
    })

    loading.dismiss();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
    this.onSubmitCreateLearningProfileForm();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  async presentAlert(subHeader: string, alertMessage: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: subHeader,
      message: alertMessage,
      buttons: ['OK'],
    });

    await alert.present();
  }


}
