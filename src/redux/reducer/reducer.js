/* eslint-disable no-case-declarations */
const initialState = {
  productList: [],
  scannedBarcodeId: ''
};

function Reducer(state = initialState, action) {
  switch (action.type) {
    case 'PRODUCT_LIST': {
      const { value } = action.payload;
      return {
        ...state,
        productList: value,
      };
    }

    case 'SCANNED_BARCODE_ID': {
      const { value } = action.payload;
      return {
        ...state,
        scannedBarcodeId: value,
      };
    }

    default:
      return state;
  }
}

export default Reducer;
