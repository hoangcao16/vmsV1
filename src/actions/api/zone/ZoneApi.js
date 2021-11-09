import { removeEmpty } from '../../../utility/vms/removeEmpty';
import { responseCheckerErrorsController } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const ZoneApi = {
  getAllZones: async (dataSearch) => {
    const data = {
      ...dataSearch,
      provinceId:
        dataSearch?.provinceId === undefined ? '' : dataSearch?.provinceId,
      districtId:
        dataSearch?.districtId === undefined ? '' : dataSearch?.districtId,
      id: dataSearch?.id === undefined ? '' : dataSearch?.id
    };

    let result;
    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/zones?provinceId=${data?.provinceId}&districtId=${data?.districtId}&wardId=${data?.id}&name=${data?.name}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },
  getAllZonesWithTotal: async (dataSearch) => {
    let result;
    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/zones`, removeEmpty(dataSearch)
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result;
  },


  getZoneByUuid: async (uuid) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/zones/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },

  addZone: async (zonePayload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/cctv-controller-svc/api/v1/zones',
        zonePayload
      );
    } catch (error) {
      console.log(error);
    }
    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },

  editZone: async (zoneId, zonePayload) => {
    console.log('zoneId:', zoneId);
    console.log('zonePayload:', zonePayload);
    let result;

    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/zones/${zoneId}`,
        zonePayload
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
        `/cctv-controller-svc/api/v1/zones/${uuid}`
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

export default ZoneApi;
