import { I18n } from 'i18n-js';

import ar from './ar.json';
import en from './en.json';

const i18n = new I18n({
  en,
  ar,
});

// Set default locale to Arabic
i18n.locale = 'ar';
i18n.enableFallback = true;
i18n.defaultLocale = 'ar';

export default i18n; 