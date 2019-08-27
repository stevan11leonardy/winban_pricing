
export const setProductListToReducer = (value) => ({
  type: 'PRODUCT_LIST',
  payload: { value },
});

export const setScannedBarcodeIdToReducer = (value) => ({
  type: 'SCANNED_BARCODE_ID',
  payload: { value },
});
