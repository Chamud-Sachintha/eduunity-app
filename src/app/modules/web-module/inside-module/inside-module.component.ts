import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TopicListPage } from 'src/app/models/TopicListPage/topic-list-page';
import { GeminiService } from 'src/app/services/gemini/gemini.service';

@Component({
  selector: 'app-inside-module',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inside-module.component.html',
  styleUrls: ['./inside-module.component.scss'],
})
export class InsideModuleComponent  implements OnInit {

  topicListPageModel = new TopicListPage();
  moduleId!: any;

  constructor(private geminiService: GeminiService, private router: Router, private activatedRoue: ActivatedRoute) { }

  ngOnInit() {
    this.moduleId = this.activatedRoue.snapshot.params['moduleId'];
    this.loadTopicList();
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
      } else {

      }
    })
  }

}
