import {createStackNavigator} from 'react-navigation-stack';
import DashboardScreen from '../../screens/DashboardScreen';
import OrderDetailsScreen from '../../screens/OrderDetailsScreen';

import TrackLocationScreen from '../../screens/TrackLocationScreen';
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  DashboardScreen: {
    screen: DashboardScreen,
  },
  OrderDetailsScreen: {
    screen: OrderDetailsScreen,
  },
  TrackLocationScreen: {
    screen: TrackLocationScreen,
  },
});
export default HomeStackNavigator;
