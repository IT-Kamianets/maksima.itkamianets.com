import { Component, inject, computed } from '@angular/core';
import { TranslationService } from './services/translation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  translation = inject(TranslationService);

  // Реактивний сигнал для перекладів
  t = (path: string) => this.translation.t(path);

  get currentLang() {
    return this.translation.currentLang();
  }

  setLang(lang: 'uk' | 'en') {
    this.translation.setLanguage(lang);
  }
}
