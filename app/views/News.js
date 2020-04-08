import React, { Component } from 'react';
import { StyleSheet, BackHandler, Dimensions, ActivityIndicator, View, Text } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';

import { WebView } from 'react-native-webview';
import { GetStoreData } from '../helpers/General';
import languages from '../locales/languages';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import fontFamily from '../constants/fonts';
import NavigationBarWrapper from '../components/NavigationBarWrapper';
import Colors from '../constants/colors';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class NewsScreen extends Component {
  constructor(props) {
    super(props);
    const default_news = {
      name: 'Safe Paths News', // TODO: translate
      url: 'https://privatekit.mit.edu',
    };
    this.state = {
      visible: true,
      default_news,
      newsUrls: [default_news, default_news],
    };
  }

  backToMain() {
    this.props.navigation.goBack();
  }

  handleBackPress = () => {
    this.props.navigation.goBack();
    return true;
  };

  hideSpinner() {
    this.setState({
      visible: false,
    });
  }

  _renderItem = (item) => {
    console.log('Item', item);
    return (
      <View style={styles.singleNews}>
        <View style={styles.singleNewsHead}>
          <Text style={styles.singleNewsHeadText}>{item.item.name}</Text>
        </View>
        <WebView
          source={{
            uri: item.item.url,
          }}
          containerStyle={{
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
          cacheEnabled
          onLoad={() =>
            this.setState({
              visible: false,
            })
          }
        />
      </View>
    );
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    GetStoreData('AUTHORITY_NEWS')
      .then((name_news) => {
        console.log('name_news:', name_news);

        // Bring in news from the various authorities.  This is
        // pulled down from the web when you subscribe to an Authority
        // on the Settings page.
        const arr = [];

        // TODO: using this as test data for now without assigning
        arr.push({
          name: 'Haitian Ministry of Health',
          url: 'https://wmcelroy.wixsite.com/covidhaiti/kat',
        });
        arr.push(this.state.default_news);

        console.log('name_news:', arr);
        this.setState({
          newsUrls: arr,
        });
      })
      .catch((error) => console.log(error));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  render() {
    console.log('News URL -', this.state.newsUrls);
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[Colors.VIOLET_BUTTON, Colors.VIOLET_BUTTON_DARK]}
        style={{ flex: 1, height: '100%' }}>
        <NavigationBarWrapper
          title={languages.t('label.latest_news')}
          onBackPress={this.backToMain.bind(this)}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={[Colors.VIOLET_BUTTON, Colors.VIOLET_BUTTON_DARK]}
            style={{ flex: 1, height: '100%' }}>
            <View
              style={{
                backgroundColor: Colors.VIOLET_BUTTON_DARK,
                flex: 1,
                paddingVertical: 16,
              }}>
              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                data={this.state.newsUrls}
                renderItem={this._renderItem}
                sliderWidth={width}
                itemWidth={width * 0.85}
                layout='default'
                scrollEnabled
              />

              {this.state.visible && (
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    top: height / 2,
                    left: width / 2,
                  }}
                  size='large'
                  color='black'
                />
              )}
            </View>
          </LinearGradient>
        </NavigationBarWrapper>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  // Container covers the entire screen
  singleNewsHead: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    marginBottom: 0,
  },
  singleNewsHeadText: {
    fontSize: 18,
    fontFamily: fontFamily.primarySemiBold,
  },
});

export default NewsScreen;
