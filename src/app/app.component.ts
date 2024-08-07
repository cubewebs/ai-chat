import {Component, ElementRef, OnInit, signal, viewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {inject} from "@angular/core";
import {GenAIService} from "./core/services/gen-ai.service";
import {ChatOutgoingComponent} from "./shared/component/chat-outgoing/chat-outgoing.component";
import {ChatStream} from "./core/models/chatStream.model";
import {v4 as uuid} from 'uuid';
import {ChatIncomingComponent} from "./shared/component/chat-incoming/chat-incoming.component";
import {TypingAnimationComponent} from "./shared/component/typing-animation/typing-animation.component";
import {NgIf} from "@angular/common";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ChatOutgoingComponent,
    ChatOutgoingComponent,
    ChatIncomingComponent,
    TypingAnimationComponent,
    NgIf,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class AppComponent implements OnInit {
  private genAiService = inject(GenAIService);
  private cs = inject(ConfirmationService);
  private ms = inject(MessageService);
  public textarea = viewChild<ElementRef<HTMLTextAreaElement>>('promptTextarea');
  title = 'AI Chat';
  public loading = signal(false);
  public chatStreamsArr = signal<ChatStream[]>([]);
  public themeMode = signal('pi-sun');
  public initialHeight = 0;

  ngOnInit(): void {
    this.loadDataFormLocalStorage();
    this.maxHeightOfTextarea();
  }

  public maxHeightOfTextarea() {
    let ta = this.textarea()!.nativeElement
    this.initialHeight = ta.scrollHeight;
    ta.addEventListener('input', () => {
      ta.style.height = `${this.initialHeight}px`;
      ta.style.height = `${ta.scrollHeight}px`;
    })
  }

  public loadDataFormLocalStorage() {
    const chatStreams = localStorage.getItem('chat-streams');
    let theme = localStorage.getItem('light-mode');
    if(!theme || theme === 'false') {
      document.body.classList.remove('light-mode');
      this.themeMode.set('pi-sun');
    } else {
      document.body.classList.add('light-mode');
      this.themeMode.set('pi-moon');
    }
    if (chatStreams) {
      this.chatStreamsArr.set(JSON.parse(chatStreams));
    }

  }

  public onLightMode() {
    document.body.classList.toggle('light-mode');
    if(document.body.classList.contains('light-mode')) {
      localStorage.setItem('light-mode', 'true')
      this.themeMode.set('pi-moon');
    } else {
      localStorage.setItem('light-mode', 'false');
      this.themeMode.set('pi-sun');
    }
  }

  public onDeleteChatStream() {
    this.cs.confirm({
      message: 'Are you sure you want to delete your conversation?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.chatStreamsArr.set([]);
        localStorage.removeItem('chat-streams');
        this.ms.add({ severity: 'success', summary: 'Confirmed', detail: 'Conversation deleted' });
      },
      reject: () => {
        this.ms.add({ severity: 'error', summary: 'Canceled', detail: 'Conversation not deleted' });
      },
      key: 'positionDialog'
    });

  }

  async handleOutgoingChat(prompt: string) {
    this.loading.set(true);
    this.chatStreamsArr.update(prev => [...prev, {id: uuid(), outgoing: true, text: prompt.trim()}]);
    await this.genAiService.generateText(prompt).then((result) => {
      this.chatStreamsArr.update(prev => [...prev, {id: uuid(), outgoing: false, text: result}]);
      localStorage.setItem('chat-streams', JSON.stringify(this.chatStreamsArr()));
      this.loading.set(false);
    });
    console.log(this.chatStreamsArr());
    const ta = this.textarea()!.nativeElement
    ta.value = '';
    ta.style.height = `${this.initialHeight}px`;
  }
}
