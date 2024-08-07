import {Component, input, signal} from '@angular/core';
import {ChatStream} from "../../../core/models/chatStream.model";

@Component({
  selector: 'app-chat-outgoing',
  standalone: true,
  imports: [],
  templateUrl: './chat-outgoing.component.html',
  styleUrl: './chat-outgoing.component.scss'
})
export class ChatOutgoingComponent {
  stream = input<ChatStream>();


}
