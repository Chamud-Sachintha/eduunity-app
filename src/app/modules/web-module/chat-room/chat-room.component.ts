import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Client } from '@stomp/stompjs'; // Ensure you're using the correct stompjs library
import * as SockJS from 'sockjs-client'; // Using SockJS for the WebSocket connection
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnInit {

  messageArray: any[] = [];
  private stompClient: Client | null = null;
  newMessage!: string;
  messageForm!: FormGroup;
  userName!: any;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createSubmitMessageControl();
    this.userName = localStorage.getItem('emailAddress');

    // Create SockJS WebSocket connection
    const socket = new SockJS(environment.web_soket); // The websocket URL from the environment

    // Set up STOMP client
    this.stompClient = new Client({
      webSocketFactory: () => socket,  // SockJS for WebSocket connection
      reconnectDelay: 5000,  // Auto-reconnect after 5 seconds
      debug: (str) => {
        console.log('STOMP: ' + str);
      }
    });

    // Handle connection success
    this.stompClient.onConnect = (frame: any) => {
      console.log('Connected: ' + frame);

      // Subscribe to private messages
      this.stompClient!.subscribe(`/user/${this.userName}/private`, (message: any) => {
        this.showMessages(JSON.parse(message.body));
      });
    };

    // Handle STOMP errors
    this.stompClient.onStompError = (frame: any) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    // Activate the STOMP connection
    this.stompClient.activate();
  }

  // Create form for message submission
  createSubmitMessageControl() {
    this.messageForm = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  // Display received messages
  showMessages(message: any) {
    this.messageArray.push(message);
  }

  // Send private message
  sendPrivateMessage() {
    const messageModel = {
      senderName: this.userName,
      recieverName: sessionStorage.getItem('recName'),
      message: this.messageForm.controls['message'].value,
      status: 'MESSAGE'
    };

    // Add to the message array
    this.messageArray.push(messageModel);

    // Send the message via WebSocket
    this.stompClient!.publish({
      destination: '/app/private-message',
      body: JSON.stringify(messageModel)
    });

    // Clear the message input
    this.messageForm.controls['message'].setValue('');
    this.newMessage = '';
  }

}
