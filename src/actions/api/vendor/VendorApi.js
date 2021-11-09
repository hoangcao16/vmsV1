import { responseCheckerErrorsController } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const VendorApi = {
  getAllVendor: async (data) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/vendors?name=${data?.name}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },
  getVendorByUuid: async (uuid) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/vendors/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },

  editVendor: async (uuid, vendorPayload) => {
    let result;

    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/vendors/${uuid}`,
        vendorPayload
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },

  addVendor: async (vendorPayload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/cctv-controller-svc/api/v1/vendors',
        vendorPayload
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },

  delete: async (uuid) => {
    let result;
    try {
      result = await MyService.deleteRequestData(
        `/cctv-controller-svc/api/v1/vendors/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  }
};

export default VendorApi;
