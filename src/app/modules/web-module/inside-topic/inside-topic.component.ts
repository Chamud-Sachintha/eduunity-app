import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { GenerateTopicContent } from 'src/app/models/GenerateTopicContent/generate-topic-content';
import { GeminiService } from 'src/app/services/gemini/gemini.service';
import { BackComponentComponent } from '../back-component/back-component.component';

@Component({
  selector: 'app-inside-topic',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, BackComponentComponent],
  templateUrl: './inside-topic.component.html',
  styleUrls: ['./inside-topic.component.scss'],
})
export class InsideTopicComponent implements OnInit {

  topicContentRequest = new GenerateTopicContent();
  moduleId!: any;
  formattedContent!: SafeHtml;
  thirdpartyLinks: any[] = [];
  backPath = '';

  constructor(private geminiService: GeminiService, private acivatedRoute: ActivatedRoute, private sanitizer: DomSanitizer
              , private loadingCtrl: LoadingController, private alertController: AlertController
  ) { }

  ngOnInit() {
    this.moduleId = this.acivatedRoute.snapshot.params['moduleId'];
    this.backPath = 'inside-module' + "/" + this.moduleId;
    this.generateTopicContent()
  }

  async generateTopicContent() {
    this.topicContentRequest.moduleId = this.moduleId;
    this.topicContentRequest.moduleContentName = localStorage.getItem("topicName");

    const loading = await this.loadingCtrl.create({
      message: ' Please wait a moment',
      translucent: true
    });

    loading.present();

    this.geminiService.getTopicContent(this.topicContentRequest).subscribe((resp: any) => {
      if (resp.code === 1) {
        const contentWithLineBreaks = resp.data
          .replace(/\n/g, '<br>')               // Convert newlines to <br> tags
          .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')  // Convert **text** to bold
          .replace(/\* ([^\n]+)\n/g, '<li>$1</li>') // Convert bullet points to <li>
          .replace(/\n<br><br>/g, '<br>'); // Adjust double newlines

          this.formattedContent = this.sanitizer.bypassSecurityTrustHtml(contentWithLineBreaks);

          resp.links.forEach((el: any) => {
            this.thirdpartyLinks.push(el);
          })

          loading.dismiss();
      } else {
        this.presentAlert("Loading Topic Content", resp.message)
        loading.dismiss();
      }
    })
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

  onClickOpenLink(link: any) {
    window.location.href = link;
    return false;
  }

}
