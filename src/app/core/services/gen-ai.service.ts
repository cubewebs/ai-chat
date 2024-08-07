import {Injectable, signal} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GenAIService {
  private apiKey = environment.API_KEY;
  public genAI = new GoogleGenerativeAI(this.apiKey);
  public model = this.genAI.getGenerativeModel({
    model: "gemini-1.5-pro-exp-0801",
  });
  public generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 9500,
    responseMimeType: "text/plain",
  };
  public result = signal('');

  constructor() { }

  async generateText(prompt: string) {
    const streamRes = await this.model.generateContentStream(prompt);
    for await ( const res of streamRes.stream ) {
      this.result.set(res.text());
    }
    return this.result();
  }
}
