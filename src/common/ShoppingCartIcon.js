import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Dimensions,
} from 'react-native';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import theme from './Theme.style';
import SyncStorage from 'sync-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import {getUrl, getHttp} from '../common/WooComFetch';
const HEIGHT = Dimensions.get('window').height;
class ShoppingCartIcon extends Component {
  ///////////////////////
  constructor(props) {
    super(props);
    this.state = {
      switch1Value: false,
      spinnerTemp: false,
      x: {
        latitude: 32.100847,
        longitude: 72.688091,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      },
    };
  }
  static getDerivedStateFromProps(props, state) {
    return {switch1Value: props.store.Config.statusOfBoy};
  }
  changeStatus = async () => {
    let status = 11;
    if (this.props.store.Config.statusOfBoy == true) {
      status = 8;
    }
    const data = await getHttp(
      getUrl() +
        '/changestatus?password=' +
        SyncStorage.get('pass') +
        '&availability_status=' +
        status,
      {},
    );
    if (data.success == 1) {
      if (this.props.store.Config.statusOfBoy) {
      } else {
      }
    }
    this.setState({
      spinnerTemp: false,
      switch1Value: this.state.switch1Value ? false : true,
    });
  };
  toggleSwitch1 = (value) => {
    this.setState({spinnerTemp: true}, () => {
      this.changeStatus();
      this.props.changeStatus1(
        this,
        this.props.store.Config.statusOfBoy ? false : true,
      );
    });
  };

  render() {
    return (
      <View
        style={[
          {
            padding: 5,
            paddingRight: 6,
          },
          styles.maincontainer,
        ]}>
        <Spinner
          visible={this.state.spinnerTemp}
          size={'small'}
          color={theme.primary}
          indicatorStyle={{paddingTop: HEIGHT * 0.062}}
        />
        <TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
            }}>
            {this.props.store.Config.statusOfBoy ? (
              <Text style={{color: '#fff'}}>online</Text>
            ) : (
              <Text style={{color: '#fff'}}>offline</Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Cart');
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Switch
              trackColor={theme.backgroundColor}
              onTintColor={theme.backgroundColor}
              thumbColor={theme.primaryDark}
              style={{
                transform: [{scaleX: 0.6}, {scaleY: 0.6}],
              }}
              onValueChange={(val) => this.toggleSwitch1(val)}
              value={this.state.switch1Value}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeStatus1: (th, value) => {
    dispatch({
      type: 'STATUS_OF_THE_BOY',
      payload: value,
    });
  },
});

const mapStateToProps = (state) => ({
  store: state,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(ShoppingCartIcon));

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    paddingLeft: 10,
    paddingTop: 10,
    marginRight: 5,
  },
});
