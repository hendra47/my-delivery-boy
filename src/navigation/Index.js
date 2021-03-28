import React from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Dimensions} from 'react-native';
import Settings from './Stacks/Settings';
import History from './Stacks/History';
import INTRO from './Stacks/Login';
import Dashboard from './Stacks/Dashboard';
import ThemeStyle from '../../src/common/Theme.style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import store from '../redux/store/index';
WIDTH = Dimensions.get('window').width;
const AppDrawer = createBottomTabNavigator(
  {
    Dashboard: {
      screen: Dashboard,
      tabBarLabel: store.getState().Config.languageJson2.Dashboard,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            name="chart-bar"
            size={20}
            style={{
              marginTop: 7,
              color: focused ? ThemeStyle.primary : ThemeStyle.secondry,
            }}
          />
        ),
      },
    },

    History: {
      screen: History,
      tabBarLabel: store.getState().Config.languageJson2.History,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            name="history"
            size={20}
            style={{
              marginTop: 7,
              color: focused ? ThemeStyle.primary : ThemeStyle.secondry,
            }}
          />
        ),
      },
    },

    Settings: {
      screen: Settings,
      tabBarLabel: store.getState().Config.languageJson2.Settings,
      navigationOptions: {
        tabBarIcon: ({tintColor, focused}) => (
          <Icon
            name="cog"
            size={25}
            style={{
              marginTop: 7,
              color: focused ? ThemeStyle.primary : ThemeStyle.secondry,
            }}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: ThemeStyle.primary,
      inactiveTintColor: ThemeStyle.secondry,
      inactiveBackgroundColor: ThemeStyle.backgroundColor,
      activeBackgroundColor: ThemeStyle.backgroundColor,
      style: {
        backgroundColor: ThemeStyle.backgroundColor,
      },
      tabStyle: {
        backgroundColor: ThemeStyle.backgroundColor,
      },
    },
  },
);
export default createAppContainer(
  createSwitchNavigator({
    INTRO: INTRO,
    AppDrawer: AppDrawer,
  }),
);
