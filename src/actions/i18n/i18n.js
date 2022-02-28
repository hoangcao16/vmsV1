import i18next from 'i18next';

import commonVN from '../i18n/locales/vn/common.json';
import commonEN from '../i18n/locales/en/common.json';
import { reactLocalStorage } from 'reactjs-localstorage';
import { isEmpty } from 'lodash';

const checkLanguage = reactLocalStorage.get('language')
if (isEmpty(checkLanguage)) {
  reactLocalStorage.set('language', 'vn')
}

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  ns: ['common'],
  defaultNS: 'common',
  lng: !isEmpty(reactLocalStorage.get('language'))
    ? reactLocalStorage.get('language'): reactLocalStorage.set('language', 'vn') , // language to use and set default for app
  resources: {
    en: {
      common: commonEN // 'common' is our custom namespace
    },
    vn: {
      common: commonVN
    }
  }
});

export default i18next;
