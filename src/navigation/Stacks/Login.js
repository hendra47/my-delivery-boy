import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from '../../screens/Intro';
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  LoginScreen: {
    screen: LoginScreen,
  },
});

export default HomeStackNavigator;
