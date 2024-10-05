import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
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

  constructor(private geminiService: GeminiService, private router: Router, private activatedRoue: ActivatedRoute) { }

  ngOnInit() {
    this.moduleId = this.activatedRoue.snapshot.params['moduleId'];
    this.loadTopicList();
  }

  onLevelUpClick() {
    this.generateNewModule.moduleName = this.moduleId;
    this.generateNewModule.experiancedLevel = 0;
    this.generateNewModule.studentId = sessionStorage.getItem("userId");

    this.geminiService.levelUpModule(this.generateNewModule).subscribe((resp: any) => {

    })
  }

  onClickTopic(topicName: any) {
    localStorage.setItem("topicName", topicName);
    this.router.navigate(['inside-topic', this.moduleId]);
  }

  loadTopicList() {
    this.geminiService.getTopicList(this.moduleId).subscribe((resp: any) => {
      if (resp.code === 1) {
        const dataList = JSON.parse(JSON.stringify(resp));

        this.topicListPageModel.modules = dataList.content.moduleContent.modules;
        this.topicListPageModel.experiancedLevel = dataList.content.experiancedLevel;
        this.experianceLevel = dataList.content.experiancedLevel;
      } else {

      }
    })
  }

}
