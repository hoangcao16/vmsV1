import { responseCheckerErrorsController } from '../../function/MyUltil/ResponseChecker';
import MyService from '../service';

const DepartmentApi = {
  getAllDepartment: async (data) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/departments?name=${data?.name}&administrativeUnitUuid=${data?.administrativeUnitUuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },
  getDepartmentByUuid: async (uuid) => {
    let result;

    try {
      result = await MyService.getRequestData(
        `/cctv-controller-svc/api/v1/departments/${uuid}`
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return [];
    }

    return result.payload;
  },
  editDepartment: async (uuid, departmentPayload) => {
    let result;

    try {
      result = await MyService.putRequestData(
        `/cctv-controller-svc/api/v1/departments/${uuid}`,
        departmentPayload
      );
    } catch (error) {
      console.log(error);
    }

    if (responseCheckerErrorsController(result) === null) {
      return false;
    }
    return true;
  },

  addDepartment: async (DepartmentPayload) => {
    let result;

    try {
      result = await MyService.postRequestData(
        '/cctv-controller-svc/api/v1/departments',
        DepartmentPayload
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
        `/cctv-controller-svc/api/v1/departments/${uuid}`
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

export default DepartmentApi;
