import { handleErrCodeReport } from "../../function/MyUltil/ResponseChecker";
import MyService from "../service";

const ReportApi = {
  getChartData: async (body) => {
    let result;

    try {
      result = await MyService.postRequestData("/owl/api/v1/get-chart", body);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    if (handleErrCodeReport(result) === null) {
      return [];
    }
    return result.payload;
  },

  getExportData: async (body) => {
    let result;
    try {
      result = await MyService.getRequestDataBlob(
        "/owl/api/v1/export-excel-data",
        body
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    return result;
  },

  getExportDataToMail: async (body) => {
    let result;
    try {
      result = await MyService.getRequestData(
        "/owl/api/v1/send-export-excel-data",
        body
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    return result;
  },

  getTableData: async (body) => {
    let result;
    try {
      result = await MyService.getRequestData(
        "/owl/api/v1/get-data-table",
        body
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    if (handleErrCodeReport(result) === null) {
      return [];
    }
    return result;
  },

  getData: async (body) => {
    let result;

    try {
      result = await MyService.getRequestData("/owl/api/v1/get-data", body);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    if (handleErrCodeReport(result) === null) {
      return [];
    }
    return result.payload;
  },

  getCompareData: async (body) => {
    let result;

    try {
      result = await MyService.getRequestData("/owl/api/v1/compare-data", body);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
    if (handleErrCodeReport(result) === null) {
      return [];
    }
    return result.payload;
  },
};

export default ReportApi;
