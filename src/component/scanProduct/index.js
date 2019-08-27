import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import { setScannedBarcodeIdToReducer } from '../../redux/action/action';

const ScanProduct = (props) => {
  const { navigation } = props;
  const { navigate, state } = navigation;
  const { isAddProduct } = state.params;
  const [startCamera, setStartCamera] = useState(false);
  const dispatch = useDispatch();

  function handleRecieveBarcode(event) {
    if (isAddProduct) {
      props.navigation.goBack();
    } else {
      navigate('ProductDetail', { id: event.data });
    }
    dispatch(setScannedBarcodeIdToReducer(event.data));
  }

  useEffect(() => {
    setStartCamera(true);
    return () => setStartCamera(false);
  }, []);

  if (startCamera) {
    return (
      <>
        <View style={styles.container}>
          <RNCamera
            onBarCodeRead={handleRecieveBarcode}
            type={RNCamera.Constants.Type.back}
            style={styles.preview}
            captureAudio={false}
          >
            {({ status }) => {
              if (status !== 'READY') return <Text>Loading...</Text>;
              return (
                <View style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                >
                  <Text style={{ fontSize: 14, color: 'white' }}> Scan Barcode </Text>
                </View>
              );
            }}
          </RNCamera>
        </View>
      </>
    );
  }
  return (
    <Text>Loading...</Text>
  );
};

ScanProduct.navigationOptions = () => ({
  title: 'Scan Barcode',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default ScanProduct;
