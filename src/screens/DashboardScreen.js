import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Linking,
  StatusBar,
  Platform,
} from 'react-native';
import HTML from 'react-native-render-html';
import Spinner from 'react-native-loading-spinner-overlay';
import {NavigationEvents} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import uuid from 'react-native-uuid';
import {connect} from 'react-redux';
import {getUrl, getHttp} from '../common/WooComFetch';
import SyncStorage from 'sync-storage';
import themeStyle from '../common/Theme.style';
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
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
  componentDidMount() {
    this.props.navigation.setParams({
      headerTitle: this.props.store.Config.languageJson2.Dashboard,
    });
  }
  /// /////////////////
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      orders: [],
      loading: true,
      refreshing: false,
      isRefreshing: false, // for pull to refresh
      spinnerTemp: false,
    };
    this.getOrders();
  }
  /// ////////////////
  addCurrecny = (order, v2) => `${order.currency} ${v2}`;
  /// /////////////////
  onRefreshTemp() {
    this.setState({isRefreshing: true, page: 1}, () => {
      this.onRefresh();
    });
  }
  /// //////////
  onRefresh = () => {
    this.getOrders();
  };
  /// ////////
  getOrders = async () => {
    const data = await getHttp(
      getUrl() +
        '/orders?password=' +
        SyncStorage.get('pass') +
        '&language_id=1',
      {},
    );
    if (data.data.success == 1) {
      this.state.orders = [];

      data.data.data.map((value) => {
        if (
          value.orders_status === 'Pending' ||
          value.orders_status === 'Inprocess' ||
          value.orders_status === 'Delivered' ||
          value.orders_status === 'Dispatched' ||
          value.orders_status === 'Return'
        ) {
          this.state.orders.push(value);
        }
      });
    }
    this.setState({
      loading: false,
      refreshing: false,
      isRefreshing: false,
      spinnerTemp: false,
    });
  };

  temp = () => {
    this.setState(
      {refreshing: this.state.orders.length > 5 ? true : false},
      () => {
        this.getOrders();
      },
    );
  };

  singaleRow(placeholderText, name, check, Status) {
    return (
      <View
        style={{
          justifyContent: 'space-between',
          padding: 6,
          flexDirection: 'row',
          backgroundColor:
            Status === 'Status' && name === 'Pending'
              ? themeStyle.primary
              : Status === 'Status' && name === 'Cancel'
              ? themeStyle.primary
              : Status === 'Status' && name === 'Inprocess'
              ? themeStyle.primary
              : Status === 'Status' && name === 'Completed'
              ? themeStyle.primary
              : Status === 'Status' && name === 'Delivered'
              ? themeStyle.primary
              : Status === 'Status' && name === 'Dispatched'
              ? themeStyle.primary
              : Status === 'Status' && name === 'Return'
              ? themeStyle.primary
              : 'white',
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: themeStyle.mediumSize,
            fontWeight: Status === 'Status' ? 'bold' : 'normal',
            color:
              Status === 'Status' && name === 'Pending'
                ? 'white'
                : Status === 'Status' && name === 'Cancel'
                ? 'white'
                : Status === 'Status' && name === 'Inprocess'
                ? 'white'
                : Status === 'Status' && name === 'Completed'
                ? 'white'
                : Status === 'Status' && name === 'Delivered'
                ? 'white'
                : Status === 'Status' && name === 'Dispatched'
                ? 'white'
                : Status === 'Status' && name === 'Return'
                ? 'white'
                : 'black',
            paddingTop: 3,
          }}>
          {placeholderText}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.props.store.Config.languageJson2.Dashboard ===
          placeholderText ? (
            <HTML
              html={SyncStorage.get('currency')}
              baseFontStyle={{
                fontSize: themeStyle.largeSize,
                color: '#000',
              }}
            />
          ) : null}
          <Text
            style={{
              textAlign: 'center',
              fontSize: themeStyle.mediumSize,
              color:
                Status === 'Status' && name === 'Pending'
                  ? 'white'
                  : Status === 'Status' && name === 'Cancel'
                  ? 'white'
                  : Status === 'Status' && name === 'Inprocess'
                  ? 'white'
                  : Status === 'Status' && name === 'Completed'
                  ? 'white'
                  : Status === 'Status' && name === 'Delivered'
                  ? 'white'
                  : Status === 'Status' && name === 'Dispatched'
                  ? 'white'
                  : Status === 'Status' && name === 'Return'
                  ? 'white'
                  : 'black',
              fontWeight: check === 1 ? 'bold' : 'normal',
            }}>
            {name}
          </Text>
        </View>
      </View>
    );
  }
  renderFooter = () => (
    <View
      style={{
        marginBottom: 30,
        marginTop: 10,
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
      }}>
      {this.state.refreshing && this.state.orders.length !== 0 ? (
        <View style={{height: 20, marginTop: 30}}>
          <ActivityIndicator
            size={'small'}
            count={12}
            color={themeStyle.loadingIndicatorColor}
          />
        </View>
      ) : null}
    </View>
  );
  ///////

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

  //////

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <StatusBar
          backgroundColor={themeStyle.primary}
          barStyle="light-content"
          borderBottomWidth={0}
        />
        <FlatList
          data={['']}
          extraData={this.state}
          listKey={'products'}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            width: WIDTH,
            backgroundColor: '#fff',
          }}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => this.renderFooter()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefreshTemp.bind(this)}
            />
          }
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              this.temp();
              this.onEndReachedCalledDuringMomentum = true;
            }
          }}
          renderItem={(item2) =>
            !this.props.store.Config.statusOfBoy ? (
              <View
                style={{
                  flex: 1,
                  backgroundColor: themeStyle.backgroundColor,
                  paddingTop: 6,
                  width: WIDTH,
                  marginTop: !this.props.store.Config.statusOfBoy
                    ? HEIGHT * 0.4
                    : 0,
                }}>
                <View style={styles.container}>
                  <Icon
                    name={'user-times'}
                    style={{color: 'gray', fontSize: 80, marginBottom: 10}}
                  />
                  <View>
                    <Text style={[styles.welcome, {color: 'gray'}]}>
                      {this.props.store.Config.languageJson2['You are offline']}
                    </Text>
                    <Text style={[styles.welcome, {color: 'gray'}]}>
                      {
                        this.props.store.Config.languageJson2[
                          'Please go online'
                        ]
                      }
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  backgroundColor: themeStyle.backgroundColor,
                  paddingTop: 6,
                  width: WIDTH,
                  marginTop: this.state.orders.length === 0 ? HEIGHT * 0.4 : 0,
                }}>
                <NavigationEvents
                  onDidFocus={() => {
                    this.setState({spinnerTemp: true}, () => {
                      this.getOrders();
                    });
                  }}
                />
                <Spinner
                  visible={this.state.spinnerTemp && !this.state.loading}
                  size={'small'}
                  color={themeStyle.primary}
                  // indicatorStyle={{paddingTop: HEIGHT * 0.056}}
                />
                {this.state.orders.length === 0 && !this.state.loading ? (
                  // &&
                  // !this.state.isRefreshing &&
                  // !this.state.refreshing
                  <View style={styles.container}>
                    <Icon
                      name={'shopping-basket'}
                      style={{color: 'gray', fontSize: 80, marginBottom: 10}}
                    />
                    <View>
                      <Text style={styles.welcome}>
                        {
                          this.props.store.Config.languageJson2[
                            'Your Order List is Empty'
                          ]
                        }
                      </Text>
                    </View>
                  </View>
                ) : null}
                {/* ///////////////////////////////// */}
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    backgroundColor: themeStyle.backgroundColor,
                  }}>
                  {this.state.loading ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                      }}>
                      <ActivityIndicator
                        size={'small'}
                        color={themeStyle.loadingIndicatorColor}
                      />
                    </View>
                  ) : (
                    <FlatList
                      data={this.state.orders}
                      extraData={this.state}
                      listKey={'data'}
                      keyExtractor={(index) => uuid.v1()}
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.isRefreshing}
                          onRefresh={this.onRefreshTemp.bind(this)}
                        />
                      }
                      onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentum = false;
                      }}
                      onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentum) {
                          this.temp();
                          this.onEndReachedCalledDuringMomentum = true;
                        }
                      }}
                      renderItem={(item) => (
                        <TouchableWithoutFeedback
                          onPress={() => {
                            this.props.navigation.push('OrderDetail', {
                              data: item.item,
                            });
                          }}>
                          <View
                            style={{
                              backgroundColor: '#fff',
                              justifyContent: 'space-between',
                              shadowOffset: {width: 1, height: 1},
                              shadowColor: 'black',
                              shadowOpacity: 0.5,
                              margin: 10,
                              marginTop: 3,
                              marginBottom: 5,
                              elevation: 5,
                            }}>
                            <View>
                              <View style={{padding: 0}}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    borderBottomWidth: 1,
                                    borderColor: themeStyle.secondry,
                                    paddingBottom: 5,
                                  }}>
                                  <TouchableOpacity
                                    style={{
                                      alignItems: 'flex-start',
                                      justifyContent: 'flex-start',
                                      padding: 5,
                                    }}
                                    onPress={() =>
                                      this.openDialScreen(
                                        item.item.delivery_phone,
                                      )
                                    }>
                                    <Text
                                      style={{
                                        fontSize: themeStyle.largeSize,
                                        fontWeight: 'bold',
                                        color: '#000',
                                        width: WIDTH * 0.36,
                                      }}
                                      numberOfLines={1}>
                                      {item.item.customers_name}
                                    </Text>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 5,
                                      }}>
                                      <Icon
                                        name="phone"
                                        style={{
                                          color: themeStyle.primaryDark,
                                          fontSize: themeStyle.mediumSize,
                                          transform: [{rotateY: '180deg'}],
                                          marginRight: 6,
                                        }}
                                      />
                                      <Text
                                        style={{
                                          fontSize: themeStyle.mediumSize - 1,
                                          color: themeStyle.primaryDark,
                                        }}>
                                        {
                                          this.props.store.Config.languageJson2[
                                            'Call to Customer'
                                          ]
                                        }
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                  <View
                                    style={{
                                      alignItems: 'flex-end',
                                      justifyContent: 'flex-end',
                                      padding: 5,
                                      paddingTop: 0,
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: themeStyle.mediumSize - 2,
                                          color: themeStyle.secondry,
                                          fontWeight: '700',
                                        }}>
                                        {
                                          this.props.store.Config.languageJson2
                                            .Status
                                        }
                                      </Text>
                                      <Text
                                        style={{
                                          fontSize: themeStyle.mediumSize - 2,
                                          color: themeStyle.primaryDark,
                                          marginLeft: 4,
                                          fontWeight: '700',
                                        }}>
                                        {item.item.orders_status}
                                      </Text>
                                    </View>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 8,
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: themeStyle.mediumSize - 1,
                                          color: themeStyle.secondry,
                                          fontWeight: '700',
                                        }}>
                                        {
                                          this.props.store.Config.languageJson2[
                                            'Placed On'
                                          ]
                                        }
                                      </Text>
                                      <Text
                                        style={{
                                          fontSize: themeStyle.mediumSize - 1,
                                          color: '#000',
                                          marginLeft: 4,
                                          fontWeight: '700',
                                        }}>
                                        {`${
                                          monthNames[
                                            new Date(
                                              item.item.date_purchased.split(
                                                ' ',
                                              )[0],
                                            ).getMonth()
                                          ]
                                        }, ${new Date(
                                          item.item.date_purchased.split(
                                            ' ',
                                          )[0],
                                        ).getDate()}, ${new Date(
                                          item.item.date_purchased.split(
                                            ' ',
                                          )[0],
                                        ).getUTCFullYear()}`}
                                      </Text>
                                    </View>
                                  </View>
                                </View>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderColor: themeStyle.secondry,
                                    paddingBottom: -8,
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      padding: 20,
                                      paddingTop: 8,
                                      paddingBottom: 8,
                                      borderRightWidth: 1,
                                      borderColor: themeStyle.secondry,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: themeStyle.mediumSize - 1,
                                        color: themeStyle.secondry,
                                      }}>
                                      {
                                        this.props.store.Config.languageJson2[
                                          'Order Id'
                                        ]
                                      }
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: themeStyle.mediumSize - 1,
                                        color: '#000',
                                        marginLeft: 4,
                                        fontWeight: '700',
                                        marginTop: 4,
                                      }}>
                                      {'#' + item.item.orders_id}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      padding: 20,
                                      paddingTop: 8,
                                      paddingBottom: 8,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: themeStyle.mediumSize - 1,
                                        color: themeStyle.secondry,
                                      }}>
                                      {
                                        this.props.store.Config.languageJson2
                                          .Amount
                                      }
                                    </Text>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 4,
                                      }}>
                                      <HTML
                                        html={SyncStorage.get('currency')}
                                        baseFontStyle={{
                                          fontSize: themeStyle.mediumSize - 1,
                                          color: '#000',
                                          marginLeft: 4,
                                          fontWeight: '700',
                                        }}
                                      />

                                      <Text
                                        style={{
                                          fontSize: themeStyle.mediumSize - 1,
                                          color: '#000',
                                          fontWeight: '700',
                                        }}>
                                        {item.item.order_price}
                                      </Text>
                                    </View>
                                  </View>

                                  <View
                                    style={{
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      padding: 20,
                                      paddingTop: 8,
                                      paddingBottom: 8,
                                      borderLeftWidth: 1,
                                      borderColor: themeStyle.secondry,
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: themeStyle.mediumSize - 1,
                                        color: themeStyle.secondry,
                                      }}>
                                      {
                                        this.props.store.Config.languageJson2[
                                          'Payment Type'
                                        ]
                                      }
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: themeStyle.mediumSize - 1,
                                        color: '#000',
                                        marginLeft: 4,
                                        fontWeight: '700',
                                        marginTop: 4,
                                      }}>
                                      {item.item.payment_method}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 8,
                                    paddingBottom: 6,
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <Icon
                                      name="map-marker-alt"
                                      style={{
                                        color: themeStyle.primaryDark,
                                        fontSize: themeStyle.mediumSize + 2,

                                        marginRight: 6,
                                      }}
                                    />
                                    <Text
                                      style={{
                                        fontSize: themeStyle.mediumSize - 1,
                                        color: themeStyle.secondry,
                                      }}>
                                      {item.item.delivery_street_address +
                                        ', ' +
                                        item.item.delivery_city +
                                        ', ' +
                                        item.item.delivery_state +
                                        ', ' +
                                        item.item.delivery_country}
                                    </Text>
                                  </View>
                                  <Icon
                                    name="location-arrow"
                                    style={{
                                      color: themeStyle.primaryDark,
                                      fontSize: themeStyle.mediumSize,
                                      transform: [{rotateY: '180deg'}],
                                      marginRight: 6,
                                    }}
                                  />
                                </View>

                                <TouchableOpacity
                                  style={{
                                    padding: 5,
                                    paddingTop: 2,
                                  }}
                                  onPress={() =>
                                    this.props.navigation.navigate(
                                      'OrderDetailsScreen',
                                      {
                                        data: item.item,
                                      },
                                    )
                                  }>
                                  <View
                                    style={{
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      padding: 8,
                                      borderWidth: 1,
                                      borderColor: themeStyle.primaryDark,
                                      borderRadius: 5,
                                      flexDirection: 'row',
                                    }}>
                                    <Text
                                      style={{
                                        textAlign: 'center',
                                        color: themeStyle.primary,
                                        fontSize: themeStyle.mediumSize - 1,
                                        fontWeight: 'bold',
                                      }}>
                                      {
                                        this.props.store.Config.languageJson2
                                          .Details
                                      }
                                    </Text>
                                    <Icon
                                      name="angle-right"
                                      style={{
                                        color: themeStyle.primary,
                                        fontSize: themeStyle.mediumSize + 1,
                                        paddingLeft: 5,
                                      }}
                                    />
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                    />
                  )}
                </View>
              </View>
            )
          }
        />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  store: state,
});

export default connect(mapStateToProps, null)(RewardPoints);

const styles = StyleSheet.create({
  container: {
    flex: 8,
    marginTop: -90,
    alignItems: 'center',
    backgroundColor: themeStyle.backgroundColor,
  },
  welcome: {
    fontSize: themeStyle.largeSize + 4,
    textAlign: 'center',
    margin: 2,
    color: '#000',
    fontWeight: '700',
  },
});
