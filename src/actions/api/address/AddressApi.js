import { responseCheckerErrorsController } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';
const AddressApi = {
  getAllProvinces: async () => {
    let result;

    try {
      result = await MyService.getRequestData(
        '/cctv-controller-svc/api/v1/provinces'
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },

  getDistrictByProvinceId: async (provinceId) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/districts/${provinceId}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },

  getWardByDistrictId: async (districtId) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/wards/${districtId}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  }
};

export default AddressApi;
