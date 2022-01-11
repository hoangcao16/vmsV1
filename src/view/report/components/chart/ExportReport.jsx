import { Image } from "antd";
import React, { useState } from "react";
import exportIcon from "../../../../assets/img/icons/report/file-export 2.png";
import "./ExportReport.scss";
import { useTranslation } from "react-i18next";
import ReportApi from "../../../../actions/api/report/ReportApi";
import fileDownload from "js-file-download";
import moment from "moment";
import { reactLocalStorage } from "reactjs-localstorage";
import { isEmpty } from "lodash";
import permissionCheck from "../../../../actions/function/MyUltil/PermissionCheck";

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
      const data = new Blob([value], { type: "application/vnd.ms-excel" });
      fileDownload(
        data,
        `Report_${moment().format("DD.MM.YYYY_HH.mm.ss")}.xlsx`
      );
    });
  };

  if (permissionCheck("export_report")) {
    return (
      <div className="Export" onClick={handleExport}>
        <Image width={20} src={exportIcon} preview={false} />
        <p className="Export__title">{t("view.report.export_data")}</p>
      </div>
    );
  } else {
    return <></>;
  }
}
