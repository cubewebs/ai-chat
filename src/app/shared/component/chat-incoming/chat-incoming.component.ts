import {Component, input} from '@angular/core';
import {ChatStream} from "../../../core/models/chatStream.model";

@Component({
  selector: 'app-chat-incoming',
  standalone: true,
  imports: [],
  templateUrl: './chat-incoming.component.html',
  styleUrl: './chat-incoming.component.scss'
})
export class ChatIncomingComponent {
  stream = input<ChatStream>();
  copyIcon = 'pi-copy';

  onCopyStream(streamText: string) {
    navigator.clipboard.writeText(streamText);
    this.copyIcon = 'pi-check';
    setTimeout(() => {
      this.copyIcon = 'pi-copy';
    }, 2000)
  }

}
