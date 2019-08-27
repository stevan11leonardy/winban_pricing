import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight
} from 'react-native';
import { createStore } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import firebase from 'firebase';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Reducer from './src/redux/reducer/reducer';
import ProductList from './src/component/productList';
import AddProduct from './src/component/addProduct';
import ProductDetail from './src/component/productDetail';
import ScanProduct from './src/component/scanProduct';
import { setProductListToReducer } from './src/redux/action/action';
import './fixedTimerBug';


const App = (props) => {
  const { navigation } = props;
  const { navigate } = navigation;
  const dispatch = useDispatch();
  useEffect(() => {
    const config = {
      apiKey: 'AIzaSyC5Eg49b0rSnIRhrh5fMTDaFkVk0YpdF68',
      authDomain: 'winban-database.firebaseapp.com',
      databaseURL: 'https://winban-database.firebaseio.com',
      projectId: 'winban-database',
      storageBucket: 'winban-database.appspot.com',
      messagingSenderId: '946800909612',
    };
    firebase.initializeApp(config);
  }, []);

  useEffect(() => {
    firebase.database().ref('product').on('value', ((resp) => {
      const serverData = Object.values(resp.val());
      dispatch(setProductListToReducer(serverData));
    }));
  }, []);

  return (
    <>
      <View
        style={styles.container}
      >
        <TouchableHighlight
          onPress={() => navigate('ScanProduct', { isAddProduct: false })}
          style={styles.homeButton}
          underlayColor="grey"
        >
          <Text style={{ textAlign: 'center' }}>Scan Product</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => navigate('ProductList')}
          style={styles.homeButton}
          underlayColor="grey"
        >
          <Text style={{ textAlign: 'center' }}>Product List</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => navigate('AddProduct', { id: null })}
          style={styles.homeButton}
          underlayColor="grey"
        >
          <Text style={{ textAlign: 'center' }}>Add Product</Text>
        </TouchableHighlight>
      </View>
    </>
  );
};

App.navigationOptions = {
  title: 'Home'
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lighter,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  homeButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    margin: 15,
    marginLeft: 12,
    marginRight: 12,
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#DDDDDD'
  }
});

const AppNavigator = createStackNavigator({
  Main: App,
  ProductList,
  AddProduct,
  ProductDetail,
  ScanProduct,
});

const AppContainer = createAppContainer(AppNavigator);

const store = createStore(Reducer);

function Index() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}

export default Index;
