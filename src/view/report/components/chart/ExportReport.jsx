import { Image } from "antd";
import fileDownload from "js-file-download";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { reactLocalStorage } from "reactjs-localstorage";
import ReportApi from "../../../../actions/api/report/ReportApi";
import permissionCheck from "../../../../actions/function/MyUltil/PermissionCheck";
import exportIcon from "../../../../assets/img/icons/report/file-export 2.png";
import Notification from "../../../../components/vms/notification/Notification";
import "./ExportReport.scss";


export default function ExportReport(props) {
  const language = reactLocalStorage.get("language");
  const { type } = props;
  const { t } = useTranslation();

  const [params, setParams] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("payloadDataChart");

    const initialValue = JSON.parse(saved);
    return initialValue || "";
  });

  const handleExport = async () => {
    const data = {
      ...params,
      typeChart: type,
      lang: language,
    };
    await ReportApi.getExportData(data).then((value) => {

      if(value.type === "application/octet-stream"){
        const data = new Blob([value], { type: "application/vnd.ms-excel" });
        fileDownload(
          data,
          `Report_${moment().format("DD.MM.YYYY_HH.mm.ss")}.xlsx`
        );

      }else{
        const notifyMess = {
          type: "error",
          title: "",
          description: `${t("noti.export_errors")}`,
        };
        Notification(notifyMess);
      }
    });
  };

  if (permissionCheck("export_report")) {
    return (
      <div className="Export" onClick={handleExport}>
        <p className="Export__title">{t("view.report.export_data")}</p>
      </div>
    );
  } else {
    return <></>;
  }
}
