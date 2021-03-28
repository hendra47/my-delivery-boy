import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  I18nManager,
  Image,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
} from 'react-native';
import {CardStyleInterpolators} from 'react-navigation-stack';
import themeStyle from '../common/Theme.style';
import {Icon} from 'native-base';
import {getImageUrl} from '../common/WooComFetch';
import {connect} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import SyncStorage from 'sync-storage';
import ImageViewer from 'react-native-image-zoom-viewer';
const {width, height} = Dimensions.get('window');
const WIDTH = Dimensions.get('window').width;
class Dashboard extends Component {
  static navigationOptions = ({navigation}) => {
    const headerStyle = navigation.getParam('headerTitle');
    return Platform.OS === 'android'
      ? {
          headerTitle: headerStyle,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerTitleStyle: {
            color: '#fff',
          },
          headerTitleAlign: 'center',
          headerTintColor: themeStyle.headerTintColor,
          headerStyle: {
            backgroundColor: themeStyle.primary,
          },
          headerForceInset: {top: 'never', vertical: 'never'},
        }
      : {
          headerTitle: headerStyle,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerTitleStyle: {
            textAlign: 'center',
            flexGrow: 1,
            alignSelf: 'center',
            color: '#fff',
          },
          headerTitleAlign: 'center',
          headerTintColor: themeStyle.headerTintColor,
          headerStyle: {
            backgroundColor: themeStyle.primary,
          },
        };
  };
  componentDidMount() {
    this.props.navigation.setParams({
      headerTitle: this.props.store.Config.languageJson2.Account,
    });
    SplashScreen.hide();
  }

  constructor(props) {
    super(props);
    this.state = {visible: false, imageUrlArray: [], index: 0};
  }
  categoryFun(text, iconName, imag) {
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
        <Text style={{fontSize: themeStyle.mediumSize, color: '#000'}}>
          {text}
        </Text>
        {iconName !== '' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyItems: 'center',
            }}>
            <Text style={{fontSize: themeStyle.mediumSize, color: '#000'}}>
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

  categoryFun2(text) {
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: '#d3d3d3',
          fontSize: themeStyle.mediumSize,
        }}>
        <Text style={{fontSize: themeStyle.mediumSize, color: '#000'}}>
          {text}
        </Text>
      </View>
    );
  }
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
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <Modal visible={this.state.visible} transparent>
            <ImageViewer
              index={this.state.index}
              imageUrls={this.state.imageUrlArray}
              enableSwipeDown
              onSwipeDown={() => this.setState({visible: false})}
              renderHeader={() => (
                <TouchableWithoutFeedback
                  style={{
                    height: 200,
                    width,
                    backgroundColor: '#fff',
                    paddingLeft: 80,
                  }}
                  onPress={() => this.setState({visible: false})}>
                  <Icon
                    onPress={() => this.setState({visible: false})}
                    name={'close'}
                    style={{
                      fontSize: 22,
                      color: '#fff',
                      width,
                      height: 100,
                      left: 0,
                      right: 0,
                      paddingLeft: !I18nManager.isRTL ? 20 : 20,
                      paddingRight: !I18nManager.isRTL ? 2 : 20,
                      paddingTop: !I18nManager.isRTL
                        ? Platform.OS === 'ios'
                          ? 70
                          : 70
                        : 70,
                      zIndex: 3,
                      position: 'absolute',
                      top: 0,
                      backgroundColor: 'transparent',
                    }}
                  />
                </TouchableWithoutFeedback>
              )}
            />
          </Modal>
          <TouchableOpacity>
            <ImageBackground
              style={{
                height: 180,
                width: WIDTH,
                backgroundColor: 'transparent',
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  height: 180,
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
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <View>
            {this.categoryFun2(this.props.store.Config.languageJson2.Personal)}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Name,
              SyncStorage.get('customerData').first_name +
                ' ' +
                SyncStorage.get('customerData').last_name,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Phone,
              SyncStorage.get('customerData').phone,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Email,
              SyncStorage.get('customerData').email,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['D-O-B'],
              SyncStorage.get('customerData').dob,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Blood Group'],
              SyncStorage.get('customerData').blood_group,
              '',
            )}
            {this.categoryFun2(this.props.store.Config.languageJson2.Bike)}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Bike Name'],
              SyncStorage.get('customerData').bike_name,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Bike Details'],
              SyncStorage.get('customerData').bike_details,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.Color,
              SyncStorage.get('customerData').bike_color,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Owner Name'],
              SyncStorage.get('customerData').owner_name,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Registration No'],
              SyncStorage.get('customerData').vehicle_registration_number,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2.License,
              '',
              SyncStorage.get('customerData').driving_license_image,
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Rc Book'],
              '',
              SyncStorage.get('customerData').vehicle_rc_book_image,
            )}
            {this.categoryFun2(this.props.store.Config.languageJson2.Social)}
            {this.categoryFun(
              this.props.store.Config.languageJson2.VoterId,
              SyncStorage.get('customerData').voter_id,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Bank Passbook'],
              '',
              SyncStorage.get('customerData').bank_passbook_image,
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Pan Card'],
              '',
              SyncStorage.get('customerData').pan_card_image,
            )}
            {this.categoryFun2(this.props.store.Config.languageJson2.Referral)}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Refferrer Name'],
              SyncStorage.get('customerData').referrer_name,
              '',
            )}
            {this.categoryFun(
              this.props.store.Config.languageJson2['Refferrer Aadhaar'],
              '',
              SyncStorage.get('customerData').referrer_aadhaar_image,
            )}
          </View>
        </ScrollView>
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
    width: WIDTH,
    zIndex: 9,
    position: 'absolute',
    flex: 1,
    padding: 15,
    marginTop: SyncStorage.get('customerData') === '' ? 75 : 50,
  },
});

export default connect(mapStateToProps, null)(Dashboard);
