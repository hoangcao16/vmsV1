import { Image } from 'antd';
import React, { useState } from 'react';
import exportIcon from '../../../../assets/img/icons/report/file-export 2.png';
import './ExportReport.scss';
import { useTranslation } from 'react-i18next';
import ReportApi from '../../../../actions/api/report/ReportApi';
import { saveAs } from 'file-saver';

export default function ExportReport(props) {

  const {type} = props;
  const { t } = useTranslation()

  const [params, setParams] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("payloadDataChart");
    
    const initialValue = JSON.parse(saved);
    return initialValue || "";
    
  });

  const handleExport = async() => {
    const data = {
      ...params,
      typeChart:type
    }
    await ReportApi.getExportData(data).then((value) => {
      var data = new Blob([value], {type: 'application/force-download'});
      var xlsxURL = window.URL.createObjectURL(data);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.href = xlsxURL;
      a.download = "Report.xlsx";
      a.click();
    })
    
  }


  return (
     <div className="Export" onClick={handleExport}>
         <Image width={20} src={exportIcon} preview={false} />
        <p className="Export__title">{t('view.report.export_data')}</p>
     </div>
  )
}
