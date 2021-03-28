import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
  StatusBar,
} from 'react-native';
import HTML from 'react-native-render-html';
import themeStyle from '../common/Theme.style';
class RefundPolicy extends Component {
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
      headerTitle: this.props.navigation.state.params.obj.name,
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={themeStyle.statusBarColor}
          barStyle="light-content"
          borderBottomWidth={0}
        />
        <ScrollView style={styles.tcContainer}>
          <HTML
            onLinkPress={(event, href) => {
              Linking.openURL(href);
            }}
            html={this.props.navigation.state.params.obj.description}
            baseFontStyle={{color: '#000'}}
          />
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  isLoading: state,
});

export default connect(mapStateToProps, null)(RefundPolicy);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: themeStyle.backgroundColor,
    flex: 1,
  },
});
