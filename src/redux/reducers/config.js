import * as global from '../../common/GlobalLanguageJson';
import SyncStorage from 'sync-storage';
import {I18nManager} from 'react-native';
import theme from '../../common/Theme.style';
const initialState = {
  languageJson2: global.a2,
  contentPages: [],
  appSettings: {},
  statusOfBoy: false,
  lat: 32.100847,
  long: 72.688091,
};
firstSetting = (state) => {
  // 1
  SyncStorage.set('tempdata', {});
  if (SyncStorage.get('languageCode') === undefined) {
    if (I18nManager.isRTL) {
      SyncStorage.set('currencyPos', 'right');
      SyncStorage.set('languageDirection', 'rtl');
    } else {
      SyncStorage.set('currencyPos', 'right');
      SyncStorage.set('languageDirection', 'ltr');
    }
    SyncStorage.set(
      'languageCode',
      I18nManager.isRTL ? theme.rtllanguageCode : theme.ltrlanguageCode,
    );
    if (
      state.appSettings !== null &&
      state.appSettings !== '' &&
      state.appSettings !== undefined
    ) {
      SyncStorage.set(
        'currency',
        state.appSettings.currency_symbol !== null &&
          state.appSettings.currency_symbol !== '' &&
          state.appSettings.currency_symbol !== undefined
          ? state.appSettings.currency_symbol
          : theme.defaultCurrency,
      );
    } else {
      SyncStorage.set('currency', theme.defaultCurrency);
    }
    SyncStorage.set('currencyCode', theme.currencyCode);
    SyncStorage.set('decimals', theme.priceDecimals);
    SyncStorage.set('defaultIcons', false);
    SyncStorage.set('cartProducts', null);
    SyncStorage.set('bottom', theme.bottomNavigation);
    SyncStorage.set('langId', I18nManager.isRTL ? '0' : '1');
  }
};
saveDefaultCurrency = () => {
  if (SyncStorage.get('appStartFirstTime') === undefined) {
    SyncStorage.set('currencyDefault', SyncStorage.get('currency'));
    SyncStorage.set('currencyCodeDefault', SyncStorage.get('currencyCode'));
    SyncStorage.set('currencyPosDefault', SyncStorage.get('currencyPos'));
    SyncStorage.set('defaultIcons', false);
    SyncStorage.set('appStartFirstTime', 'started');
    SyncStorage.set('customerData', '');
    SyncStorage.set('languageJson', '');
    SyncStorage.set('gustLogin', false);
  }
};
const Config = (state = initialState, action) => {
  switch (action.type) {
    case 'languageJson2':
      this.firstSetting(state);
      this.saveDefaultCurrency(state);
      state.languageJson2 = global.a2;
      return {
        ...state,
      };
    case 'siteSetting2':
      state.contentPages = action.payload;

      return {
        ...state,
      };
    case 'GETSETTINGS':
      state.appSettings = action.payload;

      return {
        ...state,
      };
    case 'GET_LAT_LONG':
      state.lat = action.payload.latitude;
      state.long = action.payload.longitude;

      return {
        ...state,
      };
    case 'STATUS_OF_THE_BOY':
      state.statusOfBoy = action.payload;

      return {
        ...state,
      };
  }

  return state;
};

export default Config;
