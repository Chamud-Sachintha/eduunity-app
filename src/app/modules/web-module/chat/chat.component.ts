import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat/chat.service';
import { BackComponentComponent } from '../back-component/back-component.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [IonicModule, CommonModule, BackComponentComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent  implements OnInit {

  currentDateTime!: any;
  agentList: any[] = [];

  constructor(private chatService: ChatService, public datepipe: DatePipe, private router: Router) {
    this.currentDateTime =this.datepipe.transform((new Date), 'MM/dd/yyyy h:mm:ss');
  }

  ngOnInit() {
    this.getConnectedAgentList();
  }

  getConnectedAgentList() {
    this.chatService.getAllConnectedAgentList().subscribe((data) => {
      const dataList = JSON.parse(JSON.stringify(data));

      dataList.data[0].forEach((element: any) => {
        this.agentList.push(element)
      })
    })
  }

  setAgentData(userName: any) {
    sessionStorage.setItem("recName", userName);
    this.router.navigate(['/chat-room']);
  }

}
