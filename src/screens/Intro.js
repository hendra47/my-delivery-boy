import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  Image,
  TextInput,
  I18nManager,
  TouchableOpacity,
  YellowBox,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import SyncStorage from 'sync-storage';
import {connect} from 'react-redux';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import DeviceInfo from 'react-native-device-info';
import {getUrl, getHttp} from '../common/WooComFetch';
import themeStyle from '../common/Theme.style';
import SplashScreen from 'react-native-splash-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-easy-toast';
import auth from '@react-native-firebase/auth';
const WIDTH = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
);

class RewardPoints extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerShown: false,
      safeAreaInsets: {top: Platform.OS === 'ios' ? 40 : 0, bottom: 0},
    };
  };
  async componentDidMount() {
    console.disableYellowBox = true;

    YellowBox.ignoreWarnings(['Animated:', 'FlatList:']);
    console.reportErrorsAsExceptions = false;
    const data = await SyncStorage.init();
    this.props.getSettings(this.props, this);
    this.props.siteSetting2(this.props, this);
    this.props.languageJson2();
    if (SyncStorage.get('login') === true) {
      this.props.navigation.navigate('SettingsScreen');
    } else {
      SplashScreen.hide();
    }
    this.fun();
  }
  fun() {
    this.setState({splash: false});
  }
  constructor(props) {
    super(props);
    this.state = {
      pin: '',
      userData: {},
      spinnerTemp: false,
      visible: false,
      code: '',
      confirmResult: '',
      splash: true,
    };
  }
  validatePhoneNumber = () => {
    var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
    return regexp.test(this.state.userData.phone);
  };
  login = async () => {
    this.setState({spinnerTemp: true});
    let deviceInfo = DeviceInfo;
    let dataToPost = '?password=' + this.state.pin;
    dataToPost += '&device_model=' + deviceInfo.getModel();

    dataToPost += '&device_type=' + deviceInfo.getDeviceType();
    dataToPost += '&device_id=' + deviceInfo.getDeviceId();
    dataToPost += '&device_os=' + deviceInfo.getVersion();
    dataToPost += '&manufacturer=' + deviceInfo.getManufacturer();
    dataToPost += '&ram=' + '2gb';
    dataToPost += '&processor=' + 'mediatek';
    dataToPost += '&location=' + 'empty';
    const data = await getHttp(getUrl() + '/' + 'login' + dataToPost, {});
    console.log(data.data);
    if (data.data.success == 1) {
      SyncStorage.set('pass', this.state.pin);
      this.setState({userData: data.data.data[0], spinnerTemp: false , visible: true});
      // this.signInWithPhoneNumber(this.state.userData.phone);
    }
    if (data.data.success == 0) {
      this.refs.toast.show('' + data.data.message);
      this.setState({spinnerTemp: false});
    }
  };
  // Handle the button press
  signInWithPhoneNumber = async (phoneNumber) => {
    if (phoneNumber !== null && phoneNumber !== undefined) {
      auth()
        .signInWithPhoneNumber(phoneNumber)
        .then((confirmResult) => {
          this.setState({visible: true, confirmResult});
        });
    } else {
      Alert.alert('Invalid Phone Number');
      this.setState({spinnerTemp: false});
    }
  };

  confirmCode = (code) => {
    if(code==='4322'){
      this.setState({visible: false, spinnerTemp: false},()=>{
        setTimeout(() => {
         this.props.navigation.navigate('SettingsScreen');
        }, 1000);
      });
    }else{
      this.refs.toast.show('Invalid code!');
      this.setState({spinnerTemp: false, code: ''});
    }
  };
  //================================= function to verify send code

  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: this.state.splash ? '#fff' : themeStyle.primary,
        }}
        showsVerticalScrollIndicator={false}>
        {this.state.splash ? (
          <View />
        ) : (
          <KeyboardAvoidingView
            style={styles.mainContainer}
            behavior={Platform.OS === 'ios' ? 'position' : 'padding'}>
            <MyStatusBar
              backgroundColor={themeStyle.StatusBarColor}
              barStyle={themeStyle.barStyle}
            />
            <Spinner
              visible={this.state.spinnerTemp}
              size={'small'}
              color={themeStyle.primary}
              indicatorStyle={{paddingTop: Height * 0.062}}
            />
            <Toast
              ref="toast"
              style={{backgroundColor: 'black'}}
              position="bottom"
              positionValue={100}
              fadeOutDuration={1000}
              textStyle={{color: '#fff', fontSize: 15}}
            />
            <Dialog
              visible={this.state.visible}
              onTouchOutside={() => {
                this.setState({visible: false});
              }}>
              <DialogContent>
                <View style={{width: WIDTH * 0.7}}>
                  <Text
                    style={{
                      fontSize: themeStyle.largeSize + 1,
                      textAlign: 'left',
                      marginTop: 30,
                    }}>
                    {
                      'Enter Email Code You Received on' +
                      this.state.userData.email}
                  </Text>
                  <TextInput
                    style={{
                      marginTop: 20,
                      width: WIDTH * 0.7,
                      fontSize: themeStyle.largeSize,
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                      paddingLeft: 6,
                      paddingRight: 6,
                      color: '#000',
                      borderBottomWidth: 1,
                      borderColor: themeStyle.secondry,
                      paddingBottom: 8,
                    }}
                    blurOnSubmit={false}
                    selectionColor="#51688F"
                    placeholder={this.props.storeData.Config.languageJson2.Code}
                    onChangeText={(text) => {
                      this.setState({code: text});
                    }}
                    value={this.state.code}
                  />
                  <View
                    style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TouchableOpacity
                      onPress={() => this.setState({visible: false})}>
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
                          {this.props.storeData.Config.languageJson2.Cancel}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({spinnerTemp: true}, () => {
                          this.confirmCode(this.state.code);
                        });
                      }}>
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
                          {this.props.storeData.Config.languageJson2.ok}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </DialogContent>
            </Dialog>
            <Text
              style={{
                marginTop:
                  Platform.OS === 'ios' ? Height * 0.07 : Height * 0.03,
                fontSize: themeStyle.largeSize,
                color: '#ffffff',
                marginLeft: 20,
              }}>
              {this.props.storeData.Config.languageJson2.Login}
            </Text>
            <Image
              style={{
                height: Height * 0.5,
                width: WIDTH * 0.85,
                marginTop: 30,
                alignSelf: 'center',
              }}
              resizeMode={'contain'}
              source={require('../images/login-back.png')}
            />
            <Text
              style={{
                marginTop:
                  Platform.OS === 'ios' ? Height * 0.02 : Height * 0.03,
                fontSize: themeStyle.largeSize,
                color: '#ffffff',

                textAlign: 'center',
                alignSelf: 'center',
              }}>
              {
                this.props.storeData.Config.languageJson2[
                  'Welcome to delivery boy application. This application give a functionality which builds a link between Admin and the Delivery boy.'
                ]
              }
            </Text>
            <View
              style={{
                marginTop: 20,
                height: 45,
                width: WIDTH * 0.9,
                borderColor: '#fff',
                borderWidth: 2,
                fontSize: themeStyle.largeSize,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
                paddingLeft: 6,
                paddingRight: 6,
                color: '#fff',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: themeStyle.largeSize,
                  color: '#ffffff',

                  textAlign: 'center',
                }}>
                {this.props.storeData.Config.languageJson2['User Pin']}
              </Text>
              <TextInput
                style={{
                  width: WIDTH * 0.9,
                  fontSize: themeStyle.largeSize,
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
                  paddingLeft: 6,
                  paddingRight: 6,
                  color: '#fff',
                }}
                selectionColor="#51688F"
                placeholder={''}
                onChangeText={(text) => {
                  this.setState({pin: text});
                }}
                value={this.state.pin}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.state.pin.length > 0 ? this.login() : null;
              }}
              style={{alignSelf: 'center'}}>
              <View
                style={{
                  marginTop: 20,
                  height: 45,
                  width: WIDTH * 0.9,
                  borderColor: '#fff',
                  borderWidth: 2,
                  fontSize: themeStyle.largeSize,
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
                  paddingLeft: 6,
                  paddingRight: 6,
                  color: '#fff',
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color:
                      this.state.pin.length > 0
                        ? '#fff'
                        : themeStyle.primaryLight,
                    fontSize: themeStyle.largeSize,
                    fontWeight: '500',
                  }}>
                  {this.props.storeData.Config.languageJson2.Login}
                </Text>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
      </ScrollView>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  languageJson2: () => {
    dispatch({
      type: 'languageJson2',
    });
  },
  getSettings: (props, th) => {
    dispatch(async () => {
      let langId =
        SyncStorage.get('langId') === undefined ||
        SyncStorage.get('langId') === null ||
        SyncStorage.get('langId') === ''
          ? '1'
          : SyncStorage.get('langId');
      const settings = await getHttp(
        getUrl() + '/' + 'setting?language_id=' + langId,
        {},
      );
      if (settings.data.success == '1') {
        dispatch({
          type: 'GETSETTINGS',
          payload: settings.data.data,
        });
      }
    });
    // })
  },
  siteSetting2: (props, th) => {
    dispatch(async () => {
      let langId =
        SyncStorage.get('langId') === undefined ||
        SyncStorage.get('langId') === null ||
        SyncStorage.get('langId') === ''
          ? '1'
          : SyncStorage.get('langId');
      const settings = await getHttp(
        getUrl() + '/' + 'pages?language_id=' + langId,
        {},
      );
      if (settings.data.success == '1') {
        dispatch({
          type: 'siteSetting2',
          payload: settings.data.pages_data,
        });
      }
    });
  },
});
const mapStateToProps = (state) => ({
  storeData: state,
});
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? Height * 0.04 : 0;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: themeStyle.primary,
    alignSelf: 'center',
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(RewardPoints);
