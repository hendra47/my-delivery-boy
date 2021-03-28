import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  Platform,
  Linking,
  StatusBar,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import Spinner from 'react-native-loading-spinner-overlay';
import themeStyle from '../common/Theme.style';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {NavigationEvents} from 'react-navigation';
import {getUrl, getHttp, getImageUrl} from '../common/WooComFetch';
import HTML from 'react-native-render-html';
import {connect} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import SyncStorage from 'sync-storage';
const {width, height} = Dimensions.get('window');
const HEIGHT = Dimensions.get('window').height;
WIDTH = Dimensions.get('window').width;
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
class Dashboard extends Component {
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

  async componentDidMount() {
    this.props.navigation.setParams({
      headerTitle:
        this.props.store.Config.languageJson2.Order +
        ' # ' +
        this.props.navigation.state.params.data.orders_id,
    });
    SplashScreen.hide();
  }
  static getDerivedStateFromProps(props, state) {
    return {
      tempLatitude: props.store.Config.lat,
      tempLongitude: props.store.Config.long,
    };
  }
  categoryFun2(text) {
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: '#d3d3d3',
          fontSize: themeStyle.mediumSize,
        }}>
        <Text style={{fontSize: themeStyle.mediumSize}}>{text}</Text>
      </View>
    );
  }
  centerAddress = (text, cond) => {
    return (
      <Text
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: 8,
          color: '#000',
          fontSize: themeStyle.mediumSize,
          alignSelf: 'center',
          paddingTop: 0,
          fontWeight: cond ? 'bold' : 'normal',
        }}>
        {text}
      </Text>
    );
  };

  cancelOrder = () => {
    this.state.statusToPass = 3;
    this.changeOrderStatus();
  };
  finishOrder = () => {
    this.state.statusToPass = 6;
    this.changeOrderStatus();
  };

  changeOrderStatus = async () => {
    let status = this.state.userPin;
    let comments = this.state.comments;
    let pass = SyncStorage.get('pass');
    let orderId = this.state.data.orders_id;
    this.setState({spinnerTemp: true});
    const data = await getHttp(
      getUrl() +
        '/changeorderstatus?password=' +
        pass +
        '&orders_id=' +
        orderId +
        '&orders_status_id=' +
        status +
        '&comments=' +
        comments,
      {},
    );
    if (data.data.success == 1) {
      this.refs.toast.show('' + data.data.message);
      this.setState({
        spinnerTemp: false,
        visible: false,
        userPin: '',
        comments: '',
        passCheck: false,
      });
    }
    if (data.data.success == 0) {
      this.refs.toast.show('' + data.data.message);
      this.setState({spinnerTemp: false, passCheck: false});
    }
  };
  //////////
  openDialScreen = (phoneNumber) => {
    let number = '';
    if (Platform.OS === 'ios') {
      number = 'telprompt:' + phoneNumber;
    } else {
      number = 'tel:' + phoneNumber;
    }
    Linking.canOpenURL(number).then((supported) => {
      if (supported) {
        return Linking.openURL(number).catch(() => null);
      }
    });
  };
  //////////
  requestLocationPermission = () => {
    let linkUrl = '';
    if (Platform.OS === 'ios') {
      linkUrl =
        'maps://app?saddr=' +
        this.state.tempLatitude +
        ',' +
        this.state.tempLongitude +
        '&daddr=' +
        this.state.data.delivery_latitude +
        ',' +
        this.state.data.delivery_longitude;
    } else {
      linkUrl =
        'google.navigation://?saddr=' +
        this.state.tempLatitude +
        ',' +
        this.state.tempLongitude +
        '&daddr=' +
        this.state.data.delivery_latitude +
        ',' +
        this.state.data.delivery_longitude;
    }
    Linking.canOpenURL(linkUrl).then((supported) => {
      if (supported) {
        return Linking.openURL(linkUrl).catch(() => null);
      }
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      imageUrlArray: [],
      index: 0,
      userPin: '',
      comments: '',
      statusToPass: '',
      passCheck: false,
      btn: 0,
      x: {
        latitude: 32.100847,
        longitude: 72.688091,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      },
      tempLatitude: 32.100847,
      tempLongitude: 72.688091,
      spinnerTemp: false,
      data:
        this.props.navigation.state.params.data === undefined &&
        this.props.navigation.state.params.data === null
          ? []
          : this.props.navigation.state.params.data,
    };
  }
  categoryFun(text, iconName, imag, cond, currency) {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: 11,
          paddingBottom: 8,
          paddingTop: 8,
        }}>
        <Text style={{fontSize: themeStyle.mediumSize}}>{text}</Text>
        {iconName !== '' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyItems: 'center',
            }}>
            {currency ? (
              <HTML
                html={SyncStorage.get('currency')}
                baseFontStyle={{
                  fontSize: themeStyle.mediumSize,
                  color: '#000',
                  marginLeft: 4,
                  fontWeight: cond ? 'bold' : 'normal',
                }}
              />
            ) : null}
            <Text
              style={{
                fontWeight: cond ? 'bold' : 'normal',
                fontSize: themeStyle.mediumSize,
                color: '#000',
              }}>
              {iconName}
            </Text>
          </View>
        ) : null}
        {imag !== '' ? (
          <TouchableOpacity
            onPress={() => {
              this.state.imageUrlArray = [];
              this.state.imageUrlArray.push(
                Object.create({
                  url: getImageUrl() + imag,
                  source: require('../images/placeholder.png'),
                  id: 1,
                }),
              );
              this.setState({
                visible: true,
                imageUrlArray: this.state.imageUrlArray,
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyItems: 'center',
            }}>
            <Image
              source={{uri: getImageUrl() + imag}}
              style={{height: 20, resizeMode: 'stretch', width: 20}}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
  /////////
  openMapScreen = () => {
    this.requestLocationPermission();
  };
  render() {
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
        <NavigationEvents
          onDidFocus={() => {
            if (!this.props.store.Config.statusOfBoy) {
              this.props.navigation.pop();
            }
          }}
        />
        <Toast
          ref="toast"
          style={{backgroundColor: 'black'}}
          position="top"
          positionValue={400}
          fadeOutDuration={1000}
          textStyle={{color: '#fff', fontSize: 15}}
        />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <Spinner
            visible={this.state.spinnerTemp}
            size={'small'}
            color={themeStyle.primary}
            indicatorStyle={{paddingTop: HEIGHT * 0.062}}
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
                  {this.props.store.Config.languageJson2['Change Status']}
                </Text>
                <TextInput
                  style={{
                    marginTop: 20,
                    width: WIDTH * 0.7,
                    fontSize: themeStyle.largeSize,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                    paddingLeft: 6,
                    paddingRight: 6,
                    color: this.state.passCheck ? '#000' : 'red',
                    borderBottomWidth: 1,
                    borderColor: this.state.passCheck
                      ? themeStyle.secondry
                      : 'red',
                    paddingBottom: 8,
                  }}
                  blurOnSubmit={false}
                  selectionColor={themeStyle.secondry}
                  placeholder="Status Id"
                  onChangeText={(text) => {
                    this.setState({
                      userPin: text,
                      passCheck: true,
                    });
                  }}
                  value={this.state.userPin}
                />
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
                  selectionColor={themeStyle.secondry}
                  placeholder={this.props.store.Config.languageJson2.Comments}
                  onChangeText={(text) => {
                    this.setState({comments: text});
                  }}
                  value={this.state.comments}
                />
                <View
                  style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({visible: false, comments: '', userPin: ''})
                    }>
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
                        {this.props.store.Config.languageJson2.Cancel}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={this.state.passCheck ? false : true}
                    onPress={() => {
                      if (this.state.btn === 1) {
                        this.cancelOrder();
                      } else if (this.state.btn === 2) {
                        this.finishOrder();
                      }
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
                          color: this.state.passCheck
                            ? themeStyle.primaryLight
                            : themeStyle.secondry,
                          fontSize: themeStyle.largeSize,
                          fontWeight: '500',
                        }}>
                        {this.props.store.Config.languageJson2.ok}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </DialogContent>
          </Dialog>

          <View>
            {this.categoryFun2(
              this.props.store.Config.languageJson2['Order Details'],
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['No of Products'],
              this.state.data.data.length,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Status,
              this.state.data.orders_status,
              '',
              true,
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Order Time'],
              new Date(
                parseInt(this.state.data.date_purchased, 10),
              ).toLocaleTimeString(),
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Order Date'],

              `${
                monthNames[
                  new Date(
                    this.state.data.date_purchased.split(' ')[0],
                  ).getMonth()
                ]
              }, ${new Date(
                this.state.data.date_purchased.split(' ')[0],
              ).getDate()}, ${new Date(
                this.state.data.date_purchased.split(' ')[0],
              ).getUTCFullYear()}`,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Time Slot'],
              this.state.data.delivery_time,
              '',
            )}
            {this.categoryFun2(
              this.props.store.Config.languageJson2['Price Detail'],
            )}

            {this.categoryFun(
              this.props.store.Config.languageJson2.Price,
              this.state.data.order_price,
              '',
              false,
              true,
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Delivery +
                this.props.store.Config.languageJson2.Tax,
              parseFloat(
                this.state.data.order_price - this.state.data.shipping_cost,
              ).toFixed(themeStyle.priceDecimals),
              '',
              false,
              true,
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Delivery,
              this.state.data.shipping_cost,
              '',
              false,
              true,
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Total,
              this.state.data.order_price,
              '',
              true,
              true,
            )}

            {this.categoryFun2(
              this.props.store.Config.languageJson2['Delivery Address'],
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  padding: 3,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  if (
                    this.props.store.Config.appSettings.maptype === 'external'
                  ) {
                    this.openMapScreen();
                  } else {
                    this.props.navigation.navigate('TrackLocationScreen', {
                      data: this.state.data,
                    });
                  }
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    width: WIDTH * 0.48,
                    padding: 8,
                    justifyContent: 'center',
                    borderRadius: 4,
                    borderColor: themeStyle.primary,
                    borderWidth: 1,
                    flexDirection: 'row',
                  }}>
                  <Icon
                    name="map-marker-alt"
                    style={{
                      color: themeStyle.primary,
                      fontSize: themeStyle.mediumSize + 1,
                      paddingRight: 8,
                    }}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      color: themeStyle.primary,
                      fontSize: 13,
                    }}>
                    {this.props.store.Config.languageJson2.NAVIGATE}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 3,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',

                  // paddingBottom: 10,
                }}
                onPress={() =>
                  this.openDialScreen(this.state.data.delivery_phone)
                }>
                <View
                  style={{
                    alignItems: 'center',
                    width: WIDTH * 0.48,
                    padding: 8,

                    justifyContent: 'center',
                    borderRadius: 4,
                    borderColor: themeStyle.primary,
                    borderWidth: 1,
                    flexDirection: 'row',
                  }}>
                  <Icon
                    name="phone"
                    style={{
                      color: themeStyle.primary,
                      fontSize: themeStyle.mediumSize + 1,
                      transform: [{rotateY: '180deg'}],
                    }}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      color: themeStyle.primary,
                      fontSize: 13,
                      paddingLeft: 8,
                    }}>
                    {this.props.store.Config.languageJson2.CONTACT}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {this.categoryFun(
              this.props.store.Config.languageJson2.Name,
              this.state.data.delivery_name,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Company,
              this.state.data.delivery_company,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Phone,
              this.state.data.billing_phone,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Email,
              this.state.data.email,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Post Code'],
              this.state.data.delivery_postcode,
              '',
            )}
            {this.centerAddress(
              this.props.store.Config.languageJson2['Street Address'],
              false,
            )}
            {this.centerAddress(
              this.state.data.delivery_street_address +
                ', ' +
                this.state.data.delivery_city +
                ', ' +
                this.state.data.delivery_state +
                ', ' +
                this.state.data.delivery_country,
              true,
            )}

            {this.categoryFun2(
              this.props.store.Config.languageJson2['Billing Address'],
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Name,
              this.state.data.billing_name,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Company,
              this.state.data.billing_company,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Phone,
              this.state.data.billing_phone,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Email,
              this.state.data.email,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Post Code'],
              this.state.data.billing_postcode,
              '',
            )}
            {this.centerAddress(
              this.props.store.Config.languageJson2['Street Address'],
              false,
            )}
            {this.centerAddress(
              this.state.data.billing_street_address +
                ', ' +
                this.state.data.billing_city +
                ', ' +
                this.state.data.billing_state +
                ', ' +
                this.state.data.billing_country,
              true,
            )}

            {this.categoryFun2(this.props.store.Config.languageJson2.Products)}
            {this.state.data.data.map((itemTemp) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <View>
                  <Image
                    source={{uri: getImageUrl() + itemTemp.image}}
                    style={{height: 75, resizeMode: 'stretch', width: 85}}
                  />
                </View>

                <View style={{flexDirection: 'column', marginLeft: 10}}>
                  <Text style={{fontSize: themeStyle.largeSize, color: '#000'}}>
                    {itemTemp.products_name}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <HTML
                      html={SyncStorage.get('currency')}
                      baseFontStyle={{
                        fontSize: themeStyle.mediumSize + 1,
                        color: themeStyle.secondry,
                        marginLeft: 4,
                        fontWeight: 'normal',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: themeStyle.mediumSize + 1,
                        color: themeStyle.secondry,

                        fontWeight: 'normal',
                      }}>
                      {parseFloat(
                        itemTemp.products_price * itemTemp.products_quantity,
                      ).toFixed(themeStyle.priceDecimals)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {this.categoryFun2(
              this.props.store.Config.languageJson2['Delivery Method'],
            )}
            <Text
              style={{
                fontSize: themeStyle.mediumSize,
                color: '#000',
                padding: 8,
                fontWeight: 'normal',
              }}>
              {this.state.data.shipping_method}
            </Text>
            {this.categoryFun2(
              this.props.store.Config.languageJson2['Payment Method'],
            )}
            <Text
              style={{
                fontSize: themeStyle.mediumSize,
                color: '#000',
                padding: 8,
                fontWeight: 'normal',
              }}>
              {this.state.data.payment_method}
            </Text>

            {this.state.data.coupons.length !== 0 ? (
              <View>
                {this.categoryFun2(
                  this.props.store.Config.languageJson2['Coupons Applied'],
                )}
                {this.state.data.coupons.map((value) => (
                  <View>
                    {this.categoryFun(
                      this.props.store.Config.languageJson2['Coupon Code'],
                      value.code,
                      '',
                    )}
                    {this.categoryFun(
                      this.props.store.Config.languageJson2['Coupon Price'],
                      value.amount,
                      '',
                      false,
                      true,
                    )}
                  </View>
                ))}
              </View>
            ) : null}
            {this.state.data.customer_comments != null &&
            this.state.data.customer_comments !== '' ? (
              <View>
                {this.categoryFun2(
                  this.props.store.Config.languageJson2['Order Notes'],
                )}
                <Text
                  style={{
                    fontSize: themeStyle.mediumSize,
                    color: '#000',
                    padding: 8,
                    fontWeight: 'normal',
                  }}>
                  {this.state.data.payment_method}
                </Text>
              </View>
            ) : null}

            {this.state.data.admin_comments !== null &&
            this.state.data.admin_comments !== '' ? (
              <View>
                {this.categoryFun2(
                  this.props.store.Config.languageJson2['Admin Notes'],
                )}
                <Text
                  style={{
                    fontSize: themeStyle.mediumSize,
                    color: '#000',
                    padding: 8,
                    fontWeight: 'normal',
                  }}>
                  {this.state.data.admin_comments}
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
        {this.state.data.orders_status == 'Dispatched' ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                padding: 3,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',

                // paddingBottom: 10,
              }}
              onPress={() => this.setState({visible: true, btn: 1})}>
              <View
                style={{
                  alignItems: 'center',
                  width: WIDTH * 0.48,
                  padding: 8,

                  justifyContent: 'center',
                  borderRadius: 4,
                  borderColor: themeStyle.primary,
                  borderWidth: 1,
                  flexDirection: 'row',
                }}>
                <Icon
                  name="times"
                  style={{
                    color: themeStyle.primary,
                    fontSize: themeStyle.mediumSize + 1,
                    paddingRight: 8,
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: themeStyle.primary,
                    fontSize: 13,
                  }}>
                  {this.props.store.Config.languageJson2.CANCEL}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 3,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => this.setState({visible: true, btn: 2})}>
              <View
                style={{
                  alignItems: 'center',
                  width: WIDTH * 0.48,
                  padding: 8,
                  justifyContent: 'center',
                  borderRadius: 4,
                  borderColor: themeStyle.primary,
                  borderWidth: 1,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: themeStyle.primary,
                    fontSize: 13,
                  }}>
                  {this.props.store.Config.languageJson2.DELIVER}
                </Text>
                <Icon
                  name="arrow-right"
                  style={{
                    color: themeStyle.primary,
                    fontSize: themeStyle.mediumSize + 1,
                    paddingLeft: 8,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => ({
  store: state,
});
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
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
    zIndex: 9,
    position: 'absolute',
    flex: 1,
    padding: 15,
  },
});

export default connect(mapStateToProps, null)(Dashboard);
