import {createStackNavigator} from 'react-navigation-stack';
import HistoryScreen from '../../screens/HistoryScreen';
import OrderDetailsScreen from '../../screens/OrderDetailsScreen';
import TrackLocationScreen from '../../screens/TrackLocationScreen';
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator({
  HistoryScreen: {
    screen: HistoryScreen,
  },
  OrderDetailsScreen: {
    screen: OrderDetailsScreen,
  },
  TrackLocationScreen: {
    screen: TrackLocationScreen,
  },
});

export default HomeStackNavigator;
