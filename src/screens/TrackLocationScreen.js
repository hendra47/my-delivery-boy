import React, {Component} from 'react';
import {
  View,
  Dimensions,
  Platform,
  StatusBar,
  TouchableHighlight,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import themeStyle from '../common/Theme.style';
import MapView, {Marker} from 'react-native-maps';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
const HEIGHT = Dimensions.get('window').height;
class RewardPoints extends Component {
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    return Platform.OS === 'android'
      ? {
          headerTitle: headerStyle,
          headerTitleAlign: 'center',
          headerTintColor: themeStyle.headerTintColor,
          headerStyle: {
            backgroundColor: themeStyle.primary,
          },
          headerTitleStyle: {
            color: '#fff',
          },
          headerForceInset: {top: 'never', vertical: 'never'},
        }
      : {
          headerTitle: headerStyle,
          headerTitleAlign: 'center',
          headerTintColor: themeStyle.headerTintColor,
          headerStyle: {
            backgroundColor: themeStyle.primary,
          },
          headerTitleStyle: {
            color: '#fff',
          },
        };
  };

  constructor(props) {
    super(props);
    this.state = {
      x: {
        latitude: 32.100847,
        longitude: 72.688091,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      },
      SpinnerTemp: false,
    };
    this.mapRef = null;
  }

  static getDerivedStateFromProps(props, state) {
    let newCoords = {};
    newCoords.latitude = props.isLoading.Config.lat;
    newCoords.longitude = props.isLoading.Config.long;
    newCoords.latitudeDelta = 0.09;
    newCoords.longitudeDelta = 0.09;
    return {
      x: newCoords,
    };
  }

  async componentDidMount() {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2['Map Screen'],
    });
  }

  onLayout = () => {
    setTimeout(() => {
      if (
        this.state.x !== null &&
        this.state.x !== undefined &&
        this.state.x !== null &&
        this.state.x !== undefined &&
        this.mapRef !== null
      ) {
        this.mapRef.fitToCoordinates([this.state.x, this.state.x], {
          edgePadding: {top: 200, right: 200, bottom: 200, left: 200},
          animated: false,
        });
      }
    }, 3000);
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor={themeStyle.statusBarColor}
          barStyle="light-content"
          borderBottomWidth={0}
        />
        <Spinner
          visible={this.state.spinnerTemp}
          size={'small'}
          color={themeStyle.primary}
          indicatorStyle={{paddingTop: HEIGHT * 0.062}}
        />
        <MapView
          showsUserLocation={true}
          ref={(ref) => {
            this.mapRef = ref;
          }}
          //
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          moveOnMarkerPress={false}
          showsCompass={true}
          showsPointsOfInterest={false}
          //
          style={{flex: 1}}
          showsMyLocationButton={true}
          onMapReady={this.onLayout}
          initialRegion={this.state.x}
          region={this.state.x}>
          {this.props.navigation.state.params.data.delivery_latitude !== null &&
          this.props.navigation.state.params.data.delivery_latitude !==
            undefined &&
          this.props.navigation.state.params.data.delivery_longitude !== null &&
          this.props.navigation.state.params.data.delivery_longitude !==
            undefined &&
          this.props.navigation.state.params.data.delivery_longitude !== '' &&
          this.props.navigation.state.params.data.delivery_longitude !== '' ? (
            <Marker
              coordinate={{
                latitude: parseFloat(
                  this.props.navigation.state.params.data.delivery_latitude,
                ),
                longitude: parseFloat(
                  this.props.navigation.state.params.data.delivery_longitude,
                ),
              }}
              key={1}
              title={this.props.isLoading.Config.languageJson2.Address}
              description={
                this.props.isLoading.Config.languageJson2['My Location']
              }>
              <MapView.Callout tooltip>
                <TouchableHighlight>
                  <Text
                    style={{
                      color: '#000',
                      textAlign: 'center',
                      alignSelf: 'center',
                      backgroundColor: '#fff',
                    }}>
                    {this.props.isLoading.Config.languageJson2.Address}
                    {'\n'}
                    {this.props.isLoading.Config.languageJson2['My Location']}
                  </Text>
                </TouchableHighlight>
              </MapView.Callout>
            </Marker>
          ) : null}
          <Marker
            key={2}
            coordinate={this.state.x}
            title={this.props.isLoading.Config.languageJson2.Address}
            description={
              this.props.isLoading.Config.languageJson2['Delivery Boy']
            }
            pinColor={themeStyle.primaryDark}>
            <MapView.Callout tooltip>
              <TouchableHighlight>
                <Text
                  style={{
                    color: '#000',
                    textAlign: 'center',
                    alignSelf: 'center',
                    backgroundColor: '#fff',
                  }}>
                  {this.props.isLoading.Config.languageJson2.Address}
                  {'\n'}
                  {this.props.isLoading.Config.languageJson2['Delivery Boy']}
                </Text>
              </TouchableHighlight>
            </MapView.Callout>
          </Marker>
        </MapView>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, null)(RewardPoints);
