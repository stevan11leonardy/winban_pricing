import React, { useEffect, useState } from 'react';
import {
  Text, FlatList, StyleSheet, TouchableHighlight, Picker,
  TextInput, View, ActivityIndicator, Keyboard,
} from 'react-native';
import firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux';
import NumberFormat from 'react-number-format';
import { setProductListToReducer } from '../../redux/action/action';

const ProductList = (props) => {
  const database = firebase.database();
  const { navigation } = props;
  const { navigate } = navigation;
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchValue, setSearchValue] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const productList = useSelector((state) => state.productList);
  const dispatch = useDispatch();

  useEffect(() => {
    if (productList.length === 0) {
      setIsFetching(true);
      database.ref('product').once('value').then((resp) => {
        setIsFetching(false);
        const serverData = Object.values(resp.val());
        dispatch(setProductListToReducer(serverData));
      });
    }
  }, []);

  useEffect(() => {
    setFilteredList(productList.slice().filter((e) => e.category === selectedCategory));
    setSearchValue('');
    Keyboard.dismiss();
  }, [selectedCategory]);

  useEffect(() => {
    if (searchValue === '') {
      setFilteredList(productList.slice().filter((e) => e.category === selectedCategory));
    }
  }, [searchValue, productList]);

  function handleListItemClick(id, name) {
    navigate('ProductDetail', { id, name });
  }

  function handleSearhChange(value) {
    setSearchValue(value);
    const arr = productList.slice().filter((e) => e.category === selectedCategory);
    const newArr = arr.filter((element) => {
      const searchValues = value.toLowerCase();
      const elementValue = element.productName.toLowerCase();
      return elementValue.includes(searchValues);
    });
    setFilteredList(newArr);
  }

  if (productList.length === 0) {
    return (
      <>
        <ActivityIndicator
          size="large"
          color="#0000a0"
          style={{ margin: 20 }}
        />
      </>
    );
  }
  return (
    <>
      <TextInput
        style={styles.formInput}
        autoCapitalize="words"
        placeholder="Search..."
        onChangeText={(value) => handleSearhChange(value)}
        value={searchValue}
      />
      <Picker
        selectedValue={selectedCategory}
        style={{ width: '100%', margin: 10 }}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="Oli" value="1" />
        <Picker.Item label="Baterai" value="2" />
      </Picker>
      {(isFetching)
        ? (
          <ActivityIndicator
            size="small"
            color="#0000a0"
            style={{ margin: 10 }}
          />
        )
        : (
          <FlatList
            style={styles.container}
            data={filteredList}
            renderItem={({ item }) => (
              <TouchableHighlight
                key={item.barcodeId}
                onPress={() => handleListItemClick(item.barcodeId, item.productName)}
                style={styles.list}
                underlayColor="aqua"
              >
                <View style={styles.listItem}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.productName}</Text>
                  <NumberFormat
                    value={item.productPrice}
                    thousandSeparator
                    displayType="text"
                    prefix="Rp"
                    renderText={(value) => <Text>{value}</Text>}
                  />
                </View>
              </TouchableHighlight>
            )}
          />
        )}
    </>
  );
};

ProductList.navigationOptions = {
  title: 'Product List'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  formInput: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
  },
});

export default ProductList;
