import { Image } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Parser } from 'json2csv';
import React from 'react';
import exportIcon from '../../../../assets/img/icons/report/file-export 2.png';
import './ExportReport.scss';
import { useTranslation } from 'react-i18next';

const columnTitles = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Vượt đèn đỏ',
    dataIndex: 'uv'
  },
  {
    title: 'Đi lên vỉa hè',
    dataIndex: 'pv'
  },
  {
    title: 'Không mũ bảo hiểm',
    dataIndex: 'amt'
  }
];

const data = [
  {
    name: 'Tháng 1',
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: 'Tháng 2',
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: 'Tháng 3',
    uv: 2000,
    pv: 9800,
    amt: 2290
  }
];

dayjs.extend(utc);

export default function ExportReport(props) {
  const { t } = useTranslation();
  const { currentDataSource } = props;
  // const currentDataSource = data;

  const exportCsv = async (fields) => {

    const events = currentDataSource.map((r) => {
      return {
        [r.name]: r.name
      };
    });


    const parser = new Parser();
    const csvData = parser.parse([
      {
        'Tên sự kiện': 'Sự kiện 1',
        'Tháng 1': 200,
        'Tháng 2': 200
      },
      {
        'Tên sự kiện': 'Sự kiện 2',
        'Tháng 1': 230,
        'Tháng 2': 201
      },
      {
        'Tên sự kiện': 'Sự kiện 3',
        'Tháng 1': 240,
        'Tháng 2': 201
      },
      {
        'Tên sự kiện': 'Sự kiện 4',
        'Tháng 1': 250,
        'Tháng 2': 201
      }
    ]);

    return;

    const blob = new Blob(['\ufeff', csvData]);
    const link = document.createElement('a');
    link.download = `exported-${dayjs().format('YYYYMMDD-HHmmss')}.csv`;
    link.href = URL.createObjectURL(blob);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportColumns = columnTitles.map((item) => {
    let value = item.dataIndex;

    if (Array.isArray(value)) {
      value = item.dataIndex.join('.');
    }

    return { label: item.title, value };
  });

  return (
    <>
      <div className="Export" onClick={() => exportCsv(exportColumns)}>
        <Image width={20} src={exportIcon} preview={false} />
        <p className="Export__title">{t('view.report.export_data')}</p>
      </div>
    </>
  );
}
