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

      // const url = window.URL.createObjectURL(new Blob([value]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', 'Report.xlsx'); //or any other extension
      // document.body.appendChild(link);
      // link.click();

      
      // const url = URL.createObjectURL(new Blob([value]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', "Report.xlsx");
      // document.body.appendChild(link);
      // link.click();


      // var data = new Blob([value], {type: 'application/force-download'});
      var data = new Blob([value], {type: 'application/json'});
      var xlsxURL = window.URL.createObjectURL(data);
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.href = xlsxURL;
      link.download = "Report.xlsx";
      link.click();
    })
    
  }


  return (
     <div className="Export" onClick={handleExport}>
         <Image width={20} src={exportIcon} preview={false} />
        <p className="Export__title">{t('view.report.export_data')}</p>
     </div>
  )
}
