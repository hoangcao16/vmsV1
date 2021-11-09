import i18next from 'i18next';

import commonVN from '../i18n/locales/vn/common.json';
import commonEN from '../i18n/locales/en/common.json';
import { reactLocalStorage } from 'reactjs-localstorage';
import { isEmpty } from 'lodash';

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  ns: ['common'],
  defaultNS: 'common',
  lng: !isEmpty(reactLocalStorage.get('language'))
    ? reactLocalStorage.get('language'): reactLocalStorage.get('language', 'vn') , // language to use
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
