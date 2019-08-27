import React, { useEffect, useState } from 'react';
import {
  Text, StyleSheet, TouchableHighlight,
  View, ToastAndroid,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';

const ProductDetail = (props) => {
  const { navigation } = props;
  const { navigate, goBack } = navigation;
  const { id } = navigation.state.params;
  const [productDetail, setProductDetail] = useState({});
  const productList = useSelector((state) => state.productList);

  useEffect(() => {
    const productData = productList.find((el) => el.barcodeId === id);
    if (productData) {
      setProductDetail(productData);
    } else {
      ToastAndroid.show('No Data Found.', ToastAndroid.LONG);
      goBack();
    }
  }, [productList]);

  function handleEditProduct() {
    navigate('AddProduct', { id: productDetail.barcodeId });
  }

  return (
    <>
      <View style={styles.list}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Barcode Id</Text>
        <Text style={{ fontSize: 16 }}>{productDetail.barcodeId}</Text>
      </View>
      <View style={styles.list}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Product Name</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{productDetail.productName}</Text>
      </View>
      <View style={styles.list}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Product Price</Text>
        <NumberFormat
          value={productDetail.productPrice}
          thousandSeparator
          displayType="text"
          prefix="Rp"
          renderText={(value) => <Text style={{ fontSize: 16 }}>{value}</Text>}
        />
      </View>
      <View style={styles.list}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Stocks</Text>
        <Text style={{ fontSize: 16 }}>{productDetail.stocks || 0}</Text>
      </View>
      <TouchableHighlight
        style={styles.saveButton}
        onPress={() => handleEditProduct()}
        underlayColor="#8aafff"
      >
        <Text adjustsFontSizeToFit style={styles.buttonText}>Edit</Text>
      </TouchableHighlight>
    </>
  );
};

ProductDetail.navigationOptions = () => ({
  title: 'Product Detail',
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lighter,
    flex: 1,
  },
  list: {
    width: '100%',
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
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

export default ProductDetail;
