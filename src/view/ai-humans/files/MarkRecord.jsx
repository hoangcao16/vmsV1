import { FlagOutlined } from '@ant-design/icons';
import { Rate } from 'antd';
import React, { useState } from 'react';
import StorageApi from '../../../actions/api/storage/StorageApi';
import './MarkRecord.scss';
import { useTranslation } from 'react-i18next';

const MarkRecord = (props) => {
  const { t } = useTranslation();
  const initValue = props.initValue ? 1 : 0;

  const [value, setValue] = useState(initValue);

  const handleChange = async (value) => {
    setValue(value);

    if (value == 0) {
      const payload = [
        {
          uuid: props.uuid,
          importance: false
        }
      ];

      await StorageApi.makeUnhighlightMultifiles(payload);
      return;
    }

    const payload = [
      {
        uuid: props.uuid,
        importance: true
      }
    ];

    await StorageApi.makeHighlightMultifiles(payload);
  };

  return (
    <Rate
      character={<FlagOutlined className={value === 1 ? 'highlight' : ''} />}
      count={1}
      tooltips={t('view.storage.tick')}
      onChange={handleChange}
      value={value}
    />
  );
};

export default MarkRecord;
