import { environment } from 'src/environments/environment';
import { PersistanceService } from './persistanceService';

export class I18nService {
  static defaultUserLang: string = environment.i18n.defaultLang;
  static chosenUserLang: string;

  static get userLang(): string {
    return (
      this.chosenUserLang ||
      PersistanceService.get('lang') ||
      (navigator.language || (navigator as any).userLanguage).substr(0, 2) ||
      this.defaultUserLang
    );
  }
}
