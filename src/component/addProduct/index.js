import React, { useEffect, useState } from 'react';
import {
  Text, View, StyleSheet, TouchableHighlight, Picker,
  TextInput, ActivityIndicator, ToastAndroid,
  Keyboard, ScrollView
} from 'react-native';
import firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { setScannedBarcodeIdToReducer } from '../../redux/action/action';

const AddProduct = (props) => {
  const database = firebase.database();
  const { navigation } = props;
  const { navigate } = navigation;
  const { id } = navigation.state.params;
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const scannedBarcodeId = useSelector((state) => state.scannedBarcodeId);
  const [formData, setFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [isSubmitting, setIsSubmmitting] = useState(false);

  useEffect(() => {
    dispatch(setScannedBarcodeIdToReducer(''));
  }, []);

  useEffect(() => {
    if (id) {
      const data = productList.find((e) => e.barcodeId === id);
      setFormData(data);
      setSelectedCategory(data.category);
    }
  }, [id]);

  function handleFormChange(value, target) {
    const combineNewValue = {
      ...formData,
      [target]: value
    };
    setFormData(combineNewValue);
  }

  function handleSubmitNewProduct() {
    setIsSubmmitting(true);
    database.ref(`product/${formData.barcodeId}`).set({ ...formData, category: selectedCategory }, (err) => {
      if (err) {
        setIsSubmmitting(false);
        ToastAndroid.show('Error! Cannot save data.', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Data saved.', ToastAndroid.SHORT);
        Keyboard.dismiss();
        setIsSubmmitting(false);
        setFormData({});
        dispatch(setScannedBarcodeIdToReducer(''));
        if (id) props.navigation.goBack();
      }
    });
  }

  useEffect(() => {
    if (scannedBarcodeId !== '') {
      setFormData({
        ...formData,
        barcodeId: scannedBarcodeId
      });
    }
  }, [scannedBarcodeId]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Picker
          selectedValue={selectedCategory}
          style={[{ marginLeft: 10, marginRight: 10 }, styles.formInput]}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="Oli" value="1" />
          <Picker.Item label="Baterai" value="2" />
        </Picker>
        <View style={[styles.formInput, {
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 0, paddingLeft: 10, paddingRight: 10
        }]}
        >
          <TextInput
            placeholder="Barcode Id"
            keyboardType="numeric"
            onChangeText={(value) => handleFormChange(value, 'barcodeId')}
            value={formData.barcodeId || scannedBarcodeId}
            style={{ width: '85%' }}
          />
          <TouchableHighlight
            onPress={() => navigate('ScanProduct', { isAddProduct: true })}
            style={{ width: '15%', padding: 10 }}
            underlayColor="#d1eaed"
          >
            <Text style={{ textAlign: 'center' }}>Scan</Text>
          </TouchableHighlight>
        </View>
        <TextInput
          style={styles.formInput}
          autoCapitalize="words"
          placeholder="Product Name"
          onChangeText={(value) => handleFormChange(value, 'productName')}
          value={formData.productName}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Product Price"
          keyboardType="numeric"
          onChangeText={(value) => handleFormChange(value, 'productPrice')}
          value={formData.productPrice}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Stocks"
          keyboardType="numeric"
          onChangeText={(value) => handleFormChange(value, 'stocks')}
          value={formData.stocks}
        />

      </ScrollView>
      <TouchableHighlight
        style={styles.saveButton}
        onPress={() => handleSubmitNewProduct()}
        underlayColor="#8aafff"
        disabled={formData.barcodeId === undefined || formData.barcodeId === ''}
      >
        {
          (isSubmitting)
            ? <ActivityIndicator size="small" color="#ffffff" />
            : <Text adjustsFontSizeToFit style={styles.buttonText}>Save</Text>
        }
      </TouchableHighlight>
    </View>
  );
};

AddProduct.navigationOptions = ({ navigation }) => {
  const { id } = navigation.state.params;
  if (id) {
    return {
      title: 'Edit Product'
    };
  }
  return {
    title: 'Add Product'
  };
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lighter,
    flex: 1,
  },
  formInput: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
  },
  saveButton: {
    margin: 10,
    marginTop: 'auto',
    padding: 10,
    borderRadius: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2b6eff',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  }
});

export default AddProduct;
