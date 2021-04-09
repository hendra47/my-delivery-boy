import {Dimensions} from 'react-native';
WIDTH = Dimensions.get('window').width;
import uuid from 'react-native-uuid';
// set card width according to your requirement
cardWidth = WIDTH * 0.3991;
// cardWidth= WIDTH * 0.4191 // card width for two and half card
// cardWidth= WIDTH * 0.6191 // one and half
// cardWidth= WIDTH * 0.42
Height = Dimensions.get('window').height;
cIp = '192.168.1.' + Math.floor(Math.random() * 99) + 1; //default
const cDid = uuid.v4();

export default {
  ipAdress: cIp,
  deviceId: cDid,
  url: 'https://ecom.integnamics.com/', //your site URL
  consumerKey: '3052a20d16168578374e4a5628', // Your consumer secret
  consumerSecret: '46958a8d16168578370c75b7f7', // Your consumer secret

  /////// navigation
  homeTitle: 'Delivery Buddy',
  bottomNavigation: false,
  // please reset app cache after changing these five values
  defaultCurrency: '&#36;',
  currencyCode: 'USD',
  priceDecimals: 2,
  // by default language for ltr
  ltrlanguageCode: 'en',
  // by default language for rtl
  rtllanguageCode: 'ar',

  statusBarColor: '#0055cb',

  primaryDark: '#0055cb',
  primary: '#FFD86C',
  // primaryLight: '#8096bf',
  primaryLight: '#000',
  // secondry: '#4d4d4d',
  secondry: '#000',
  // backgroundColor: '#fdfcfa',
  backgroundColor: '#ffffff',

  headerTintColor: '#ffffff',

  loadingIndicatorColor: '#3980ff',

  textColor: '#000',
  largeSize: 16,
  mediumSize: 14,
  smallSize: 12,
};
