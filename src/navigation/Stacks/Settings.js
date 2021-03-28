import {createStackNavigator} from 'react-navigation-stack';
import SettingsScreen from '../../screens/SettingsScreen';
import AccountInfoScreen from '../../screens/AccountInfoScreen';
import TermsConScreen from '../../screens/TermsConScreen';
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  SettingsScreen: {
    screen: SettingsScreen,
  },
  AccountInfoScreen: {
    screen: AccountInfoScreen,
  },
  TermsConScreen: {
    screen: TermsConScreen,
  },
});

export default HomeStackNavigator;
