import {
    handleErrCodeReport,
  } from "../../function/MyUltil/ResponseChecker";
  import MyService from "../service";

const ReportApi = {
    getChartData: async (body) => {
        let result;

        try {
            result = await MyService.postRequestData(
            "/owl/api/v1/get-chart", body
            );
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
        debugger;
        try {
            result = await MyService.postRequestDataBlob(
            "/owl/api/v1/export-excel", body
            );
        } catch (error) {
            console.log(JSON.stringify(error));
        }

    
        return result;
    },
}


export default ReportApi;