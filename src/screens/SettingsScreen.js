import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  I18nManager,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  StatusBar,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import themeStyle from '../common/Theme.style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getUrl, getHttp} from '../common/WooComFetch';
import Toast from 'react-native-easy-toast';
import HTML from 'react-native-render-html';
import {connect} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import SyncStorage from 'sync-storage';
import ShoppingCartIcon from '../common/ShoppingCartIcon';
import Spinner from 'react-native-loading-spinner-overlay';
import {ScrollView} from 'react-native-gesture-handler';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import Geolocation from '@react-native-community/geolocation';
import BackgroundService from 'react-native-background-actions';
import database from '@react-native-firebase/database';
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
let watchId = 123;
let options = {
  taskName: themeStyle.title + '',
  taskTitle: 'Background Tracking',
  taskDesc: 'ENABLED',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: themeStyle.primary,
  parameters: {
    delay: 1000,
  },
};
class CreateAccount extends Component {
  /// /////////////////////////////////////////////////////////
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    const fun = navigation.getParam('getBoyInfo');
    return Platform.OS === 'android'
      ? {
          headerTitle: headerStyle,
          headerRight: () => <ShoppingCartIcon navigation={navigation} />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                fun();
              }}>
              <Icon
                name={'redo-alt'}
                style={{color: '#fff', fontSize: 18, marginLeft: 20}}
              />
            </TouchableOpacity>
          ),
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
          headerRight: () => <ShoppingCartIcon navigation={navigation} />,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                fun();
              }}>
              <Icon
                name={'redo-alt'}
                style={{color: '#fff', fontSize: 18, marginLeft: 20}}
              />
            </TouchableOpacity>
          ),
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
  /// /////////////////////////////////////////////////////////

  static getDerivedStateFromProps(props, state) {
    return {statusOfBoy: props.isLoading.Config.statusOfBoy};
  }

  async componentDidMount() {
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.Config.languageJson2.Settings,
      getBoyInfo: () => {
        this.setState({spinnerTemp: true}, () => {
          this.getBoyInfo();
        });
      },
    });
    SplashScreen.hide();
    this.getBoyInfo();
  }
  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: themeStyle.title,
          message: themeStyle.title + 'App access to your location ',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        watchId = Geolocation.watchPosition(
          (info) => {
            let newCoords = {};
            newCoords.latitude = parseFloat(
              JSON.stringify(info.coords.latitude),
            );
            newCoords.longitude = parseFloat(
              JSON.stringify(info.coords.longitude),
            );
            newCoords.latitudeDelta = 0.09;
            newCoords.longitudeDelta = 0.09;
            this.props.changeLatLong(this.props, newCoords);
            database()
              .ref('location/' + '234')
              .set({
                latitude: newCoords.latitude,
                longitude: newCoords.longitude,
                source: 'app Background',
              });
            this.setState({
              x: newCoords,
              SpinnerTemp: false,
            });
          },
          (error) => {
            this.refs.toast.show(error.message);
            this.setState({
              SpinnerTemp: false,
            });
          },
          {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
        );
      } else {
        this.setState({
          SpinnerTemp: false,
        });
      }
    } catch (err) {
      this.refs.toast.show(err);
      this.setState({
        SpinnerTemp: false,
      });
    }
  };
  veryIntensiveTask = async () => {
    if (Platform.OS === 'android') {
      await this.requestLocationPermission();
    } else {
      watchId = Geolocation.watchPosition(
        (info) => {
          let newCoords = {};
          newCoords.latitude = parseFloat(JSON.stringify(info.coords.latitude));
          newCoords.longitude = parseFloat(
            JSON.stringify(info.coords.longitude),
          );
          newCoords.latitudeDelta = 0.09;
          newCoords.longitudeDelta = 0.09;
          this.props.changeLatLong(this.props, newCoords);
          database()
            .ref('location/' + '234')
            .set({
              latitude: newCoords.latitude,
              longitude: newCoords.longitude,
              source: 'app Background',
            });
          this.setState({
            x: newCoords,
            SpinnerTemp: false,
          });
        },

        (error) => {
          this.refs.toast.show(error.message);
          this.setState({
            SpinnerTemp: false,
          });
        },
        {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
      );
    }
  };
  /// //////////////////////////////////////////////////////////
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      errorMessage: '',
      spinnerTemp: true,
      switch1Value: false,
      switch2Value: false,
      setting: {},
      dialogVisible: false,
      x: {
        latitude: 32.100847,
        longitude: 72.688091,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      },
      statusOfBoy: false,
    };
  }
  ///////////////////////////////////////////////////////////
  getBoyInfo = async (value) => {
    const data = await getHttp(
      getUrl() +
        '/deliveryboyinfo?password=' +
        SyncStorage.get('pass') +
        '&language_id=1',
      {},
    );
    if (data.data.success == 1) {
      SyncStorage.set('customerData', data.data.data[0]);
      if (data.data.data[0].availability_status == 8) {
        this.props.changeStatus1(this.props, false);
      } else {
        this.props.changeStatus1(this.props, true);
      }
      this.setState({spinnerTemp: false});
    }
    if (data.data.success == 0) {
      this.setState({spinnerTemp: false});
    }
    this.setState({spinnerTemp: false});
  };
  /// ////////////////////////////////////////////////////
  changeStatus = async () => {
    // this.setState({spinnerTemp: true});
    let status = 11;
    const json = await getHttp(
      getUrl() +
        '/' +
        'changestatus?password=' +
        SyncStorage.get('pass') +
        '&availability_status=' +
        status,
      {},
    );
    this.setState({spinnerTemp: false});
    SyncStorage.set('customerData', '');
    SyncStorage.set('login', false);
    this.props.navigation.navigate('LoginScreen');
  };
  ////////////////////////////////////////////////////////
  logOut = () => {
    this.props.isLoading.Config.statusOfBoy = false;
    this.setState({statusOfBoy: false, spinnerTemp: true}, () => {
      this.changeStatus();
    });
  };
  ////////////////////////////////////////////////////////
  categoryFun(text, iconName, nav, obj) {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: 8,
            paddingBottom: 0,
            paddingTop: 0,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.categoryView}
            onPress={() => {
              if (nav == 'Legal') {
                this.setState({dialogVisible: true});
              }
              this.props.navigation.push(nav, {
                obj,
              });
            }}>
            <View style={styles.tabComponents}>
              <Text style={{fontSize: themeStyle.mediumSize, color: '#000000'}}>
                {text}
              </Text>
              {iconName !== '' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyItems: 'center',
                  }}>
                  <HTML
                    html={SyncStorage.get('currency')}
                    baseFontStyle={{
                      fontSize: themeStyle.mediumSize,
                      color: '#000',
                      marginTop: 0,
                    }}
                  />
                  <Text
                    style={{fontSize: themeStyle.mediumSize, color: '#000000'}}>
                    {iconName}
                  </Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginLeft: 16,
            marginRight: 16,
            width: '96%',
            height: 1,
            backgroundColor: '#4d4d4d',
          }}
        />
      </View>
    );
  }
  /// /////////////////////////////////////////////
  render() {
    if (this.state.statusOfBoy === false) {
      BackgroundService.stop();
      Geolocation.stopObserving();
    } else if (this.state.statusOfBoy === true) {
      BackgroundService.start(this.veryIntensiveTask(), options);
    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#f4f4f4',
          paddingBottom: SyncStorage.get('bottom') ? 50 : 0,
        }}>
        <StatusBar
          backgroundColor={themeStyle.statusBarColor}
          barStyle="light-content"
          borderBottomWidth={0}
        />
        <Toast
          ref="toast"
          style={{backgroundColor: 'black'}}
          position="top"
          positionValue={400}
          fadeOutDuration={1000}
          textStyle={{color: '#fff', fontSize: 15}}
        />
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#f4f4f4',

              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Spinner
              visible={this.state.spinnerTemp}
              size={'small'}
              color={themeStyle.primary}
              indicatorStyle={{paddingTop: HEIGHT * 0.062}}
            />
            <NavigationEvents
              onDidFocus={() => {
                this.setState({spinnerTemp: true}, () => {
                  this.getBoyInfo();
                });
              }}
            />
            <Dialog
              visible={this.state.dialogVisible}
              onTouchOutside={() => {
                this.setState({dialogVisible: false});
              }}>
              <DialogContent>
                <View style={{width: WIDTH * 0.7}}>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity
                      onPress={() => this.setState({dialogVisible: false})}>
                      <View
                        style={{
                          marginTop: 15,
                          height: 45,
                          borderColor: '#fff',
                          borderWidth: 2,
                          marginLeft: 20,
                          fontSize: themeStyle.largeSize,
                          textAlign: I18nManager.isRTL ? 'right' : 'left',
                          paddingLeft: 6,
                          paddingRight: 6,
                          color: '#fff',
                          borderRadius: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: themeStyle.primaryLight,
                            fontSize: themeStyle.largeSize,
                            fontWeight: '500',
                          }}>
                          {this.props.isLoading.Config.languageJson2.Cancel}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View
                        style={{
                          marginTop: 15,
                          height: 45,
                          borderColor: '#fff',
                          borderWidth: 2,
                          marginLeft: 20,
                          fontSize: themeStyle.largeSize,
                          textAlign: I18nManager.isRTL ? 'right' : 'left',
                          paddingLeft: 6,
                          paddingRight: 6,
                          color: '#fff',
                          borderRadius: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: themeStyle.primaryLight,
                            fontSize: themeStyle.largeSize,
                            fontWeight: '500',
                          }}>
                          {this.props.isLoading.Config.languageJson2.ok}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </DialogContent>
            </Dialog>
            <View
              style={{
                flex: 1,
                backgroundColor: themeStyle.primary,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity>
                <ImageBackground
                  style={{
                    height: 230,
                    width: WIDTH,
                    backgroundColor: 'transparent',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      height: 230,
                      width: WIDTH,
                      alignContent: 'center',
                      opacity: 0.85,
                      backgroundColor: themeStyle.primary,
                      zIndex: 9,
                      position: 'absolute',
                    }}
                  />
                  <View style={styles.textImageContainer}>
                    <View
                      style={{
                        shadowOffset: {width: 1, height: 1},
                        shadowColor: 'black',
                        shadowOpacity: 0.4,
                        elevation: 3,
                        borderRadius: 60 / 2,
                        height: 60,
                        width: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: themeStyle.primaryDark,
                        borderWidth: 2,
                      }}>
                      <Text
                        style={{
                          fontSize: themeStyle.largeSize + 15,
                          color: themeStyle.textColor,
                        }}>
                        {String(SyncStorage.get('customerData').first_name)
                          .charAt(0)
                          .toLocaleUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                        }}>
                        {SyncStorage.get('customerData') === '' ? null : (
                          <Text style={styles.NameText}>
                            {SyncStorage.get('customerData').first_name +
                              ' ' +
                              SyncStorage.get('customerData').last_name}
                          </Text>
                        )}
                        {SyncStorage.get('customerData') === '' ? null : (
                          <Text style={styles.welcomeText}>
                            {SyncStorage.get('customerData').email}
                          </Text>
                        )}
                        {SyncStorage.get('customerData') === '' ? null : (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyItems: 'center',
                            }}>
                            <HTML
                              html={SyncStorage.get('currency')}
                              baseFontStyle={{
                                fontSize: themeStyle.mediumSize + 7,
                                color: '#fff',
                                marginTop: 0,
                              }}
                            />
                            <Text
                              style={[
                                styles.welcomeText,
                                {
                                  fontSize: themeStyle.mediumSize + 7,
                                },
                              ]}>
                              {SyncStorage.get('customerData').flosting_cash}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>

            <View height={7} />

            <View height={7} />

            <View>
              <View
                style={{
                  marginLeft: 16,
                  marginRight: 16,
                  width: '96%',
                  height: 1,
                  backgroundColor: '#4d4d4d',
                }}
              />
            </View>

            {this.categoryFun(
              this.props.isLoading.Config.languageJson2['Floating Cash'],
              SyncStorage.get('customerData').flosting_cash,
              'AdressesScreen',
            )}
            {this.categoryFun(
              this.props.isLoading.Config.languageJson2['Account Info'],
              '',
              'AccountInfoScreen',
            )}
            {this.props.isLoading.Config.contentPages.length > 0
              ? this.props.isLoading.Config.contentPages.map((value) =>
                  this.categoryFun(value.name, '', 'TermsConScreen', value),
                )
              : null}

            <View height={7} />
          </View>
        </ScrollView>
        {SyncStorage.get('gustLogin') ||
        SyncStorage.get('customerData') === '' ? null : (
          <TouchableOpacity
            style={{
              paddingTop: 5,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => this.logOut()}>
            <View
              style={{
                alignItems: 'center',
                height: 40,
                width: WIDTH,
                backgroundColor: themeStyle.primary,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: 13,
                }}>
                {this.props.isLoading.Config.languageJson2['Log Out']}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state,
});
const mapDispatchToProps = (dispatch) => ({
  changeStatus1: (props2, value) => {
    dispatch({
      type: 'STATUS_OF_THE_BOY',
      payload: value,
    });
  },
  changeLatLong: (props2, value) => {
    dispatch({
      type: 'GET_LAT_LONG',
      payload: value,
    });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: themeStyle.mediumSize + 1,
    color: '#fff',
    fontWeight: '400',
    paddingTop: 3,
    paddingBottom: 3,
  },
  NameText: {
    fontSize: themeStyle.largeSize + 2,
    fontWeight: '600',
    color: '#fff',
    paddingTop: 8,
  },
  textImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    width: WIDTH,
    zIndex: 9,
    position: 'absolute',
    flex: 1,
    padding: 15,
    marginTop: SyncStorage.get('customerData') === '' ? 75 : 50,
  },
  categoryView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  tabComponents: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 13,
  },
});
