import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { TopicListPage } from 'src/app/models/TopicListPage/topic-list-page';
import { GeminiService } from 'src/app/services/gemini/gemini.service';
import { BackComponentComponent } from '../back-component/back-component.component';
import { GenerateNewModuleRequest } from 'src/app/models/GenerateNewModuleRequest/generate-new-module-request';

@Component({
  selector: 'app-inside-module',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, BackComponentComponent],
  templateUrl: './inside-module.component.html',
  styleUrls: ['./inside-module.component.scss'],
})
export class InsideModuleComponent  implements OnInit {

  generateNewModule = new GenerateNewModuleRequest();
  topicListPageModel = new TopicListPage();
  moduleId!: any;
  experianceLevel!: string;

  constructor(private geminiService: GeminiService, private router: Router, private activatedRoue: ActivatedRoute
              , private loadingCtrl: LoadingController, private alertController: AlertController
  ) { }

  ngOnInit() {
    this.moduleId = this.activatedRoue.snapshot.params['moduleId'];
    this.loadTopicList();
  }

  async onLevelUpClick() {
    this.generateNewModule.moduleName = this.moduleId;
    this.generateNewModule.experiancedLevel = 0;
    this.generateNewModule.studentId = sessionStorage.getItem("userId");

    const loading = await this.loadingCtrl.create({
      message: ' Please wait a moment',
      translucent: true
    });

    loading.present();

    this.geminiService.levelUpModule(this.generateNewModule).subscribe((resp: any) => {
      if (resp.code === 1) {
        this.presentAlert("Level Up Module", resp.message);
      } else {
        this.presentAlert("Level Up Module", resp.message);
      }
    })

    loading.dismiss();
  }

  onClickTopic(topicName: any) {
    localStorage.setItem("topicName", topicName);
    this.router.navigate(['inside-topic', this.moduleId]);
  }

  async loadTopicList() {

    const loading = await this.loadingCtrl.create({
      message: ' Please wait a moment',
      translucent: true
    });

    loading.present();

    this.geminiService.getTopicList(this.moduleId).subscribe((resp: any) => {
      if (resp.code === 1) {
        const dataList = JSON.parse(JSON.stringify(resp));

        this.topicListPageModel.modules = dataList.content.moduleContent.modules;

        try {
          this.topicListPageModel.modules.forEach((el: any, i) => {
            console.log(el)
          })
        } catch (err) {
          this.topicListPageModel.modules = Object.values(dataList.content.moduleContent.modules).map(value => ({ title: value }));
        }

        this.topicListPageModel.experiancedLevel = dataList.content.experiancedLevel;
        this.experianceLevel = dataList.content.experiancedLevel;
      } else {
        this.presentAlert("Getting Topic List", resp.message);
      }
    })

    loading.dismiss();
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
