import { environment } from 'src/environments/environment';
import { StateProperties, StateService } from './state.service';

export class I18nService {
  static defaultUserLang: string = environment.i18n.defaultLang;
  static chosenUserLang: string;

  static state: StateService;

  static get userLang(): string {
    return (
      this.chosenUserLang ||
      localStorage?.getItem(StateProperties.LANG) ||
      (navigator.language || (navigator as any).userLanguage).substr(0, 2) ||
      this.defaultUserLang
    );
  }
}
