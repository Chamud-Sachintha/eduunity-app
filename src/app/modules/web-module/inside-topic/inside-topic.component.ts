import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GenerateTopicContent } from 'src/app/models/GenerateTopicContent/generate-topic-content';
import { GeminiService } from 'src/app/services/gemini/gemini.service';

@Component({
  selector: 'app-inside-topic',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inside-topic.component.html',
  styleUrls: ['./inside-topic.component.scss'],
})
export class InsideTopicComponent implements OnInit {

  topicContentRequest = new GenerateTopicContent();
  moduleId!: any;
  formattedContent!: SafeHtml;
  thirdpartyLinks: any[] = [];

  constructor(private geminiService: GeminiService, private acivatedRoute: ActivatedRoute, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.moduleId = this.acivatedRoute.snapshot.params['moduleId'];
    this.generateTopicContent()
  }

  generateTopicContent() {
    this.topicContentRequest.moduleId = this.moduleId;
    this.topicContentRequest.moduleContentName = localStorage.getItem("topicName");

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
      } else {

      }
    })
  }

  onClickOpenLink(link: any) {
    window.location.href = link;
    return false;
  }

}
