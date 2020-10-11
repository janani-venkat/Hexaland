const apiMapping = {
  ADD: 'addHexagon',
  FETCH: 'getHexagon',
  UPDATE: 'updateHexagon',
};

const TOASTR_CNST = {
  closeButton: true,
  timeOut: 3000,
  extendedTimeOut: 2000,
};

export const HEX_CNST = {
  BASE_URL: 'http://localhost:6001/api/hexaland/',
  API_MAPPING: apiMapping,
  TOASTR_CNST,
};
