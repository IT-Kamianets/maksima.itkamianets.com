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
    "hero": { "title": "Готель MAXIMA", "subtitle": "MAXIMAльно зручно – як вдома! Відпочинок у Кам'янці-Подільському" },
    "about": { 
      "title": "Про наш готель", 
      "content": "Готельний комплекс 'Maxima' – це затишний приватний готель сімейного типу. Ми знаходимося всього в 500 метрах від унікального мосту 'Біжуча лань'. Наш готель розрахований на невелику кількість гостей (до 20 осіб), що дозволяє забезпечити індивідуальний підхід до кожного. Це ваш дім і прихисток для вашого авто, ваш офіс за потреби та місце для справжнього відпочинку." 
    },
    "important": { "title": "Важлива інформація", "beds_title": "Додаткові ліжка", "beds_desc": "Ми можемо додати ліжка або дитячі ліжечка. Зверніться до адміністрації для уточнення деталей.", "prepayment_title": "Умови проживання", "prepayment_desc": "Ми зв'яжемося з вами щодо передоплати, яку необхідно здійснити протягом 5 днів. За користування кондиціонером може стягуватися додаткова плата." },
    "services": {
      "title": "Наші послуги та зручності",
      "business": "Бізнес-послуги (засідання, банкети)",
      "food": "Сніданок включено, вечеря на замовлення",
      "in_room": "У номерах: ТБ, Фен, Чайник, Wi-Fi",
      "reception": "Цілодобова стійка, магазин на території",
      "wifi": "Безкоштовний Wi-Fi по всьому готелю",
      "parking": "Автостоянка під охороною для вашого авто"
    },
    "rooms": { 
      "title": "Наші номери", 
      "book_now": "Забронювати на Booking.com", 
      "select": "Замовити",
      "standard": { "name": "Стандартний двомісний номер", "beds": "1 широке двоспальне ліжко", "features": "ТБ, чайник, фен, москітна сітка, вид на подвір'я" },
      "comfort": { "name": "Двомісний номер 'Комфорт'", "beds": "1 широке двоспальне або 2 односпальні ліжка", "features": "18 кв. м, вид на місто, Wi-Fi, ТБ" },
      "junior_suite": { "name": "Напівлюкс", "beds": "1 широке двоспальне ліжко", "features": "32 кв. м, балкон, тераса, кондиціонер, ТБ" },
      "comfort_junior": { "name": "Напівлюкс 'Комфорт'", "beds": "2 односпальні ліжка та диван (до 5 осіб)", "features": "40 кв. м, кондиціонер, холодильник, ТБ, 3 крісла" }
    },
    "footer": { 
      "address": "пр-т Грушевського, 41 б, Кам'янець-Подільський (500м від мосту 'Біжуча лань')", 
      "phones": "+38-096-918-77-66, +38-03849-50252, +38-099-448-51-10",
      "copyright": "© 2026 Всі права захищені." 
    }
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
