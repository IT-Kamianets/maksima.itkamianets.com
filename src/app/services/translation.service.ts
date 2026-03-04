import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  // Дефолтні значення для негайного відображення
  private defaultData: any = {
    "nav": { "home": "Головна", "about": "Про нас", "services": "Послуги", "rooms": "Номери", "contact": "Контакти" },
    "hero": { "title": "Готель MAXIMA", "subtitle": "Комфорт та затишок у самому серці Кам'янця-Подільського" },
    "about": { 
      "title": "Про готель", 
      "content": "Готель MAXIMA розташований у мальовничому місті Кам'янець-Подільський. Ми пропонуємо комфортабельні номери, високий рівень обслуговування та гостинну атмосферу." 
    },
    "important": { "title": "Важлива інформація", "beds_title": "Додаткові ліжка", "prepayment_title": "Передоплата" },
    "rooms": { "title": "Наші номери", "book_now": "Забронювати", "select": "Вибрати" },
    "footer": { "address": "проспект Грушевського, 41 б, Кам'янець-Подільський", "copyright": "© 2026 Всі права захищені." }
  };

  translations = signal<any>(this.defaultData);
  currentLang = signal<'uk' | 'en'>('uk');

  constructor(private http: HttpClient) {
    this.loadTranslations(this.currentLang());
  }

  async setLanguage(lang: 'uk' | 'en') {
    this.currentLang.set(lang);
    await this.loadTranslations(lang);
  }

  private async loadTranslations(lang: string) {
    try {
      const data = await firstValueFrom(this.http.get(`./i18n/${lang}.json`));
      this.translations.set(data);
    } catch (error) {
      console.warn('Using default translations');
    }
  }

  t(path: string): string {
    const data = this.translations();
    const keys = path.split('.');
    let result = data;
    
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        // Якщо в завантажених даних немає ключа, шукаємо в дефолтних
        let fallback = this.defaultData;
        for (const fKey of keys) {
          fallback = fallback ? fallback[fKey] : null;
        }
        return fallback || path;
      }
    }
    return result || path;
  }
}
