import { Col, DatePicker, Divider, Form, Row, Select, Table } from 'antd';
import { isEmpty, set } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AddressApi from '../../../../actions/api/address/AddressApi';
import EventApi from '../../../../actions/api/event/EventApi';
import FieldApi from '../../../../actions/api/field/FieldApi';
import clearData from '../../../../actions/function/MyUltil/CheckData';
import Notification from '../../../../components/vms/notification/Notification';
import '../../../../view/commonStyle/commonDatePicker.scss';
import { DATA_FAKE_CAMERA } from '../../../camera/ModalAddCamera';
import {
  filterOption,
  normalizeOptions
} from '../../../common/select/CustomSelect';
import { loadDataChart } from '../../redux/actions';
import { changeChart } from '../../redux/actions/changeChart';
import { changeTitle } from '../../redux/actions/changeTitle';
import { changeCount } from '../../redux/actions/changeCount';
import './../../../../view/commonStyle/commonInput.scss';
import './../../../../view/commonStyle/commonSelect.scss';
import './sidebar.scss';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 }
};
const SELECTED_TIME = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year'
};

function Sidebar(props) {
  const { t } = useTranslation();
  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_CAMERA);

  const [provinceId, setProvinceId] = useState(['2']);

  const [districts, setDistrict] = useState([]);

  const [districtId, setDistrictId] = useState(null);

  const [wards, setWard] = useState([]);

  const [wardId, setWardId] = useState(null);

  const [form] = Form.useForm();

  const [dataTime, setDatatime] = useState(SELECTED_TIME.DAY);

  const [timeStartDay, setTimeStartDay] = useState(
    moment().subtract(12, 'day')
  );
  const [timeEndDay, setTimeEndDay] = useState(moment());

  const [timeStartMonth, setTimeStartMonth] = useState(
    moment().subtract(12, 'month')
  );
  const [timeEndMonth, setTimeEndMonth] = useState(moment());

  const [timeStartYear, setTimeStartYear] = useState(
    moment().subtract(5, 'year')
  );
  const [timeEndYear, setTimeEndYear] = useState(moment());

  const [hiddenDistrictAndWard, setHiddenDistrictAndWard] = useState(true);

  const [hiddenWard, setHiddenWard] = useState(true);

  const [eventList, setEventList] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [feildIds, setFeildIds] = useState([]);
  const [isShowLineAndPieChart, setisShowLineAndPieChart] = useState(true);

  useEffect(() => {
    fetchSelectOptions().then((data) => {
      setFilterOptions(data);

      // setSelectedRowKeys([data?.fields[0]?.eventList[0].uuid]);

      if (
        data &&
        !isEmpty(data.fields) &&
        !isEmpty(data?.fields[0]?.eventList) &&
        !isEmpty(data?.fields[0]?.eventList[0].uuid)
      ) {
        setEventList(data?.fields[0]?.eventList);
        setSelectedRowKeys([data?.fields[0]?.eventList[0].uuid]);

        props.changeTitle(data?.fields[0].name);

        form.setFieldsValue({
          fieldId: data?.fields[0].uuid
        });

        setFeildIds(data?.fields[0].uuid);

        const dataDefault = {
          pickTime: dataTime,
          timeStartDay: timeStartDay,
          timeEndDay: timeEndDay,
          timeStartMonth: '',
          timeEndMonth: '',
          timeStartYear: '',
          timeEndYear: '',
          provinceId: ['2'],
          districtId: '',
          wardId: '',
          fieldId: data?.fields[0].uuid,
          eventList: [data?.fields[0]?.eventList[0].uuid]
        };

        props.callData(clearData(dataDefault));
        props.changeCount(1);
      }
    });
    const isShowLineAndPieChart = hiddenDistrictAndWard && hiddenWard; 

    props.changeChart(isShowLineAndPieChart);
  }, []);

  useEffect(() => {
    const isShowLineAndPieChart = hiddenDistrictAndWard && hiddenWard;
    props.changeChart(isShowLineAndPieChart);
  }, [hiddenDistrictAndWard, hiddenWard]);

  useEffect(() => {
    setDistrict([]);

    if (provinceId.length === 1) {
      AddressApi.getDistrictByProvinceId(provinceId).then(setDistrict);
    }
    if (provinceId.length > 5) {
      const notifyMess = {
        type: 'error',
        title: '',
        description: 'Số lượng khu vực không được vượt quá 5'
      };
      Notification(notifyMess);
      
      return;
    }
  }, [provinceId]);

  useEffect(() => {
    setWard([]);

    if (districtId && provinceId.length === 1) {
      AddressApi.getWardByDistrictId(districtId).then(setWard);
    }
  }, [districtId]);

  const { provinces, fields } = filterOptions;

  const onChangeField = (feildId) => {
    const dataFilter = fields.find((f) => f.uuid === feildId);

    props.changeTitle(dataFilter.name);

    setEventList(dataFilter.eventList);

    if (isEmpty(dataFilter.eventList)) {
      const notifyMess = {
        type: 'warning',
        title: '',
        description: 'Lĩnh vực này chưa có sự kiện, vui lòng chọn lĩnh vực khác'
      };
      Notification(notifyMess);
      setSelectedRowKeys(null);
      return;
    }

    setSelectedRowKeys([dataFilter.eventList[0].uuid]);

    //Call API
    const data = {
      pickTime: dataTime,
      timeStartDay: timeStartDay,
      timeEndDay: timeEndDay,
      timeStartMonth: timeStartMonth,
      timeEndMonth: timeEndMonth,
      timeStartYear: timeStartYear,
      timeEndYear: timeEndYear,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildId,
      eventList: [dataFilter.eventList[0].uuid]
    };

    props.callData(clearData(data));
  };

  useEffect(() => {
    const data = {
      pickTime: dataTime,
      timeStartDay: timeStartDay,
      timeEndDay: timeEndDay,
      timeStartMonth: timeStartMonth,
      timeEndMonth: timeEndMonth,
      timeStartYear: timeStartYear,
      timeEndYear: timeEndYear,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys
    };
    props.callData(clearData(data));
  },[selectedRowKeys, dataTime, timeStartDay, timeEndDay, timeStartMonth, timeEndMonth, timeStartYear, timeEndYear, provinceId, districtId, wardId, feildIds])

  const onChangeCity = async (cityIdArr) => {
    if (cityIdArr.length < 1) {
      form.setFieldsValue({
        provinceId: provinceId
      });
    }

    if (cityIdArr.length == 1) {
      setHiddenDistrictAndWard(true);
      setHiddenWard(true);
      setisShowLineAndPieChart(true);
      setProvinceId(cityIdArr);
      setSelectedRowKeys([filterOptions?.fields[0]?.eventList[0].uuid]);
      form.setFieldsValue({ districtId: undefined, wardId: undefined });
      
      //Call API
      // const data = {
      //   pickTime: dataTime,
      //   timeStartDay: timeStartDay,
      //   timeEndDay: timeEndDay,
      //   timeStartMonth: timeStartMonth,
      //   timeEndMonth: timeEndMonth,
      //   timeStartYear: timeStartYear,
      //   timeEndYear: timeEndYear,
      //   provinceId: cityIdArr,
      //   districtId: districtId,
      //   wardId: wardId,
      //   fieldId: feildIds,
      //   eventList: selectedRowKeys
      // };
      

      // props.callData(clearData(data));

      return;
    } else if (cityIdArr.length > 1) {
      setHiddenDistrictAndWard(false);
      setHiddenWard(false);
      setisShowLineAndPieChart(false)
      form.setFieldsValue({ districtId: undefined, wardId: undefined });
      setProvinceId(cityIdArr);
      setSelectedRowKeys([filterOptions?.fields[0]?.eventList[0].uuid]);
      //Call API
      // const data = {
      //   pickTime: dataTime,
      //   timeStartDay: timeStartDay,
      //   timeEndDay: timeEndDay,
      //   timeStartMonth: timeStartMonth,
      //   timeEndMonth: timeEndMonth,
      //   timeStartYear: timeStartYear,
      //   timeEndYear: timeEndYear,
      //   provinceId: cityIdArr,
      //   districtId: districtId,
      //   wardId: wardId,
      //   fieldId: feildIds,
      //   eventList: selectedRowKeys
      // };
      // props.callData(clearData(data));
      return;
    }
    form.setFieldsValue({ districtId: undefined, wardId: undefined });
  };

  const onChangeDistrict = async (districtIdArr) => {
    if (districtIdArr.length === 1) {
      setHiddenWard(true);
      setisShowLineAndPieChart(true)
      setDistrictId(districtIdArr);
      setSelectedRowKeys([filterOptions?.fields[0]?.eventList[0].uuid]);
      form.setFieldsValue({ wardId: undefined });
      //Call API
      // const data = {
      //   pickTime: dataTime,
      //   timeStartDay: timeStartDay,
      //   timeEndDay: timeEndDay,
      //   timeStartMonth: timeStartMonth,
      //   timeEndMonth: timeEndMonth,
      //   timeStartYear: timeStartYear,
      //   timeEndYear: timeEndYear,
      //   provinceId: provinceId,
      //   districtId: districtIdArr,
      //   wardId: wardId,
      //   fieldId: feildIds,
      //   eventList: selectedRowKeys
      // };

      // props.callData(clearData(data));

      return;
    } else if (districtIdArr.length > 1) {
      setHiddenWard(false);
      setisShowLineAndPieChart(false)
      setDistrictId(districtIdArr);
      setSelectedRowKeys([filterOptions?.fields[0]?.eventList[0].uuid]);
      form.setFieldsValue({ wardId: undefined });
      //Call API
      // const data = {
      //   pickTime: dataTime,
      //   timeStartDay: timeStartDay,
      //   timeEndDay: timeEndDay,
      //   timeStartMonth: timeStartMonth,
      //   timeEndMonth: timeEndMonth,
      //   timeStartYear: timeStartYear,
      //   timeEndYear: timeEndYear,
      //   provinceId: provinceId,
      //   districtId: districtIdArr,
      //   wardId: wardId,
      //   fieldId: feildIds,
      //   eventList: selectedRowKeys
      // };

      // props.callData(clearData(data));

      return;
    }
    form.setFieldsValue({ wardId: undefined });
  };

  const onChangeWard = (wardIdArr) => {
    if (wardIdArr.length === 1) {
      setWardId(wardIdArr);
      setisShowLineAndPieChart(true)
      props.changeChart(true);
      setSelectedRowKeys([filterOptions?.fields[0]?.eventList[0].uuid]);
      //Call API
      // const data = {
      //   pickTime: dataTime,
      //   timeStartDay: timeStartDay,
      //   timeEndDay: timeEndDay,
      //   timeStartMonth: timeStartMonth,
      //   timeEndMonth: timeEndMonth,
      //   timeStartYear: timeStartYear,
      //   timeEndYear: timeEndYear,
      //   provinceId: provinceId,
      //   districtId: districtId,
      //   wardId: wardIdArr,
      //   fieldId: feildIds,
      //   eventList: selectedRowKeys
      // };

      // props.callData(clearData(data));

      return;
    } else if (wardIdArr.length > 1) {
      setisShowLineAndPieChart(false)
      setWardId(wardIdArr);
      setSelectedRowKeys([filterOptions?.fields[0]?.eventList[0].uuid]);
      props.changeChart(false);
      //Call API
      // const data = {
      //   pickTime: dataTime,
      //   timeStartDay: timeStartDay,
      //   timeEndDay: timeEndDay,
      //   timeStartMonth: timeStartMonth,
      //   timeEndMonth: timeEndMonth,
      //   timeStartYear: timeStartYear,
      //   timeEndYear: timeEndYear,
      //   provinceId: provinceId,
      //   districtId: districtId,
      //   wardId: wardIdArr,
      //   fieldId: feildIds,
      //   eventList: selectedRowKeys
      // };
      // props.callData(clearData(data));

      return;
    }
    props.changeChart(true);
  };

  const eventColumns = [
    {
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      className: 'headerColums'
    }
  ];

  const onSelectChange = (selectedRowKeys) => {
    if (isShowLineAndPieChart === true) {
      if (selectedRowKeys.length < 1 || selectedRowKeys.length > 3) {
        const notifyMess = {
          type: 'error',
          title: '',
          description: 'Số lượng sự kiện phải trong khoảng từ 1 đến 3'
        };
        Notification(notifyMess);
        
        return;
      }
      setSelectedRowKeys(selectedRowKeys);
      props.changeCount(selectedRowKeys);
      
      //Call API
      const data = {
        pickTime: dataTime,
        timeStartDay: timeStartDay,
        timeEndDay: timeEndDay,
        timeStartMonth: timeStartMonth,
        timeEndMonth: timeEndMonth,
        timeStartYear: timeStartYear,
        timeEndYear: timeEndYear,
        provinceId: provinceId,
        districtId: districtId,
        wardId: wardId,
        fieldId: feildIds,
        eventList: selectedRowKeys
      };
      props.callData(clearData(data));
    } else {
      if (selectedRowKeys.length > 1) {
        const notifyMess = {
          type: 'error',
          title: '',
          description: 'Số lượng sự kiện phải bằng 1'
        };
        Notification(notifyMess);
        
        return;
      }
      setSelectedRowKeys(selectedRowKeys);
      props.changeCount(selectedRowKeys);
      
      //Call API
      const data = {
        pickTime: dataTime,
        timeStartDay: timeStartDay,
        timeEndDay: timeEndDay,
        timeStartMonth: timeStartMonth,
        timeEndMonth: timeEndMonth,
        timeStartYear: timeStartYear,
        timeEndYear: timeEndYear,
        provinceId: provinceId,
        districtId: districtId,
        wardId: wardId,
        fieldId: feildIds,
        eventList: selectedRowKeys
      };
      
      props.callData(clearData(data));
    }
  };
    
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange
    };
    
  function onChange(value) {
    setDatatime(value);

    //Call API
    const data = {
      pickTime: value,
      timeStartDay: timeStartDay,
      timeEndDay: timeEndDay,
      timeStartMonth: timeStartMonth,
      timeEndMonth: timeEndMonth,
      timeStartYear: timeStartYear,
      timeEndYear: timeEndYear,
      provinceId: provinceId || ['2'],
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys
    };

    props.callData(clearData(data));
  }

  //=================================================================

  function onChangeTimeStartDay(value) {
    if (!value) {
      form.setFieldsValue({
        timeEndDay: timeEndDay
      });
      return;
    }

    setTimeStartDay(value);

    //Call API
    const data = {
      pickTime: dataTime,
      timeStartDay: value,
      timeEndDay: timeEndDay,
      timeStartMonth: timeStartMonth,
      timeEndMonth: timeEndMonth,
      timeStartYear: timeStartYear,
      timeEndYear: timeEndYear,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys
    };

    props.callData(clearData(data));
  }

  function onChangeTimeEndDay(value) {
    setTimeEndDay(value);

    const currentStart = form.getFieldValue('timeStartDay');

    const dk = moment(currentStart).add(2, 'days');

    if (!value) {
      form.setFieldsValue({
        timeStartDay: timeStartDay
      });
      return;
    }

    if (dk > value) {
      form.setFieldsValue({
        timeStartDay: ''
      });

      const notifyMess = {
        type: 'error',
        title: '',
        description:
          'Khoảng thời gian bạn chọn chưa đúng, vui lòng chọn lại thời gian'
      };
      Notification(notifyMess);

      return;
    }

    //Call API
    const data = {
      pickTime: dataTime,
      timeStartDay: timeStartDay,
      timeEndDay: value,
      timeStartMonth: timeStartMonth,
      timeEndMonth: timeEndMonth,
      timeStartYear: timeStartYear,
      timeEndYear: timeEndYear,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys
    };

    props.callData(clearData(data));
  }

  function disabledDateTimeStartDay(current) {
    const start = moment(timeEndDay).subtract(12, 'days');
    const end = moment(timeEndDay).subtract(2, 'days');
    return current < start || current > end;
  }

  function disabledDateTimeEndDay(current) {
    return current > moment();
  }

  //=================================================================

  function onChangeTimeStartMonth(value) {
    if (!value) {
      form.setFieldsValue({
        timeEndMonth: timeEndMonth
      });
      return;
    }

    setTimeStartMonth(value);

    //Call API
    const data = {
      pickTime: dataTime,
      timeStartDay: timeStartDay,
      timeEndDay: timeEndDay,
      timeStartMonth: value,
      timeEndMonth: timeEndMonth,
      timeStartYear: timeStartYear,
      timeEndYear: timeEndYear,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys
    };

    props.callData(clearData(data));
  }

  function onChangeTimeEndMonth(value) {
    setTimeEndMonth(value);

    const currentStart = form.getFieldValue('timeStartMonth');

    const dk = moment(currentStart).add(2, 'month');

    if (!value) {
      form.setFieldsValue({
        timeStartMonth: timeStartMonth
      });
      return;
    }

    if (dk > value) {
      form.setFieldsValue({
        timeStartMonth: ''
      });

      const notifyMess = {
        type: 'error',
        title: '',
        description:
          'Khoảng thời gian bạn chọn chưa đúng, vui lòng chọn lại thời gian'
      };
      Notification(notifyMess);
      return;
    }

    //Call API
    const data = {
      pickTime: dataTime,
      timeStartDay: timeStartDay,
      timeEndDay: timeEndDay,
      timeStartMonth: timeStartMonth,
      timeEndMonth: value,
      timeStartYear: timeStartYear,
      timeEndYear: timeEndYear,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys
    };

    props.callData(clearData(data));
  }

  function disabledDateTimeStartMonth(current) {
    const start = moment(timeEndMonth).subtract(12, 'month');
    const end = moment(timeEndMonth).subtract(2, 'month');
    return current < start || current > end;
  }

  function disabledDateTimeEndMonth(current) {
    return current > moment();
  }

  //=================================================================

  function onChangeTimeStartYear(value) {
    if (!value) {
      form.setFieldsValue({
        timeEndYear: timeEndYear
      });
      return;
    }

    setTimeStartYear(value);

    //Call API
    const data = {
      pickTime: dataTime,
      timeStartDay: timeStartDay,
      timeEndDay: timeEndDay,
      timeStartMonth: timeStartMonth,
      timeEndMonth: timeEndMonth,
      timeStartYear: value,
      timeEndYear: timeEndYear,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys
    };

    props.callData(clearData(data));
  }

  function onChangeTimeEndYear(value) {
    setTimeEndYear(value);

    const currentStart = form.getFieldValue('timeStartYear');

    const dk = moment(currentStart).add(2, 'year');

    if (!value) {
      form.setFieldsValue({
        timeStartYear: timeStartYear
      });
      return;
    }

    if (dk > value) {
      form.setFieldsValue({
        timeStartYear: ''
      });

      const notifyMess = {
        type: 'error',
        title: '',
        description:
          'Khoảng thời gian bạn chọn chưa đúng, vui lòng chọn lại thời gian'
      };
      Notification(notifyMess);
      return;
    }

    //Call API
    const data = {
      pickTime: dataTime,
      timeStartDay: timeStartDay,
      timeEndDay: timeEndDay,
      timeStartMonth: timeStartMonth,
      timeEndMonth: timeEndMonth,
      timeStartYear: timeStartYear,
      timeEndYear: value,
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      fieldId: feildIds,
      eventList: selectedRowKeys
    };

    props.callData(clearData(data));
  }

  function disabledDateTimeStartYear(current) {
    const start = moment(timeEndYear).subtract(5, 'year');
    const end = moment(timeEndYear).subtract(2, 'year');
    return current < start || current > end;
  }

  function disabledDateTimeEndYear(current) {
    return current > moment();
  }

  return (
    <div className="sidebar">
      <div className="sidebarOption">
        <Form
          className="mt-2 bg-grey"
          form={form}
          {...formItemLayout}
          style={{ width: '100%', paddingBottom: '30px' }}
        >
          <label className="optionTitle">{t('view.report.view_by')}</label>
          <Row gutter={24} style={{ margin: '5px' }}>
            <Col span={24}>
              <Form.Item name={['pickTime']}>
                <Select defaultValue="day" onChange={onChange}>
                  <Option value="day">{t('view.report.day')}</Option>
                  <Option value="month">{t('view.report.month')}</Option>
                  <Option value="year">{t('view.report.year')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ margin: 0, color: 'red' }} />
          <label className="optionTitle">{t('view.report.date_range')}</label>

          {dataTime === SELECTED_TIME.DAY && (
            <Row gutter={24} style={{ margin: '5px' }}>
              <Col span={12}>
                <Form.Item name={['timeStartDay']}>
                  <DatePicker
                    allowClear={false}
                    picker="date"
                    format="DD/MM/YYYY"
                    defaultValue={moment().subtract(12, 'day')}
                    disabledDate={disabledDateTimeStartDay}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeStartDay}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['timeEndDay']}>
                  <DatePicker
                    allowClear={false}
                    picker="date"
                    format="DD/MM/YYYY"
                    defaultValue={moment()}
                    disabledDate={disabledDateTimeEndDay}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeEndDay}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {dataTime === SELECTED_TIME.MONTH && (
            <Row gutter={24} style={{ margin: '5px' }}>
              <Col span={12}>
                <Form.Item name={['timeStartMonth']}>
                  <DatePicker
                    allowClear={false}
                    picker="month"
                    format="MM/YYYY"
                    defaultValue={moment().subtract(12, 'months')}
                    disabledDate={disabledDateTimeStartMonth}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeStartMonth}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['timeEndMonth']}>
                  <DatePicker
                    allowClear={false}
                    picker="month"
                    format="MM/YYYY"
                    defaultValue={moment()}
                    disabledDate={disabledDateTimeEndMonth}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeEndMonth}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {dataTime === SELECTED_TIME.YEAR && (
            <Row gutter={24} style={{ margin: '5px' }}>
              <Col span={12}>
                <Form.Item name={['timeStartYear']}>
                  <DatePicker
                    allowClear={false}
                    picker="year"
                    format="YYYY"
                    defaultValue={moment().subtract(5, 'year')}
                    disabledDate={disabledDateTimeStartYear}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeStartYear}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['timeEndYear']}>
                  <DatePicker
                    allowClear={false}
                    picker="year"
                    format="YYYY"
                    defaultValue={moment()}
                    disabledDate={disabledDateTimeEndYear}
                    dropdownClassName="dropdown__date-picker"
                    onChange={onChangeTimeEndYear}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Divider style={{ margin: 0, color: 'red' }} />

          <label className="optionTitle">{t('view.map.zone')}</label>
          <Row gutter={24} style={{ margin: '5px' }}>
            <Col span={24}>
              <Form.Item name={['provinceId']}>
                <Select
                  defaultValue={['2']}
                  mode="multiple"
                  allowClear={false}
                  showSearch
                  dataSource={provinces}
                  onChange={(cityId) => onChangeCity(cityId)}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'provinceId', provinces)}
                  placeholder={t('view.map.province_id')}
                />
              </Form.Item>
            </Col>
          </Row>

          {hiddenDistrictAndWard && (
            <>
              <Divider style={{ margin: 0, color: 'red' }} />

              <Row gutter={24} style={{ margin: '5px' }}>
                <Col span={24}>
                  <Form.Item name={['districtId']}>
                    <Select
                      mode="multiple"
                      allowClear={false}
                      showSearch
                      dataSource={districts}
                      onChange={(districtId) => onChangeDistrict(districtId)}
                      filterOption={filterOption}
                      options={normalizeOptions(
                        'name',
                        'districtId',
                        districts
                      )}
                      placeholder={t('view.map.district_id')}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {hiddenWard && (
            <>
              <Divider style={{ margin: 0, color: 'red' }} />

              <Row gutter={24} style={{ margin: '5px' }}>
                <Col span={24}>
                  <Form.Item name={['wardId']}>
                    <Select
                      mode="multiple"
                      allowClear={false}
                      showSearch
                      dataSource={wards}
                      filterOption={filterOption}
                      options={normalizeOptions('name', 'id', wards)}
                      placeholder={t('view.map.ward_id')}
                      onChange={(wardId) => onChangeWard(wardId)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <label className="optionTitle">{t('view.category.field')}</label>
          <Row gutter={24} style={{ margin: '5px' }}>
            <Col span={24}>
              <Form.Item name={['fieldId']}>
                <Select
                  allowClear={false}
                  showSearch
                  dataSource={fields}
                  onChange={(fieldId) => onChangeField(fieldId)}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'uuid', fields)}
                  placeholder={t('view.category.field')}
                />
              </Form.Item>
            </Col>
          </Row>

          {isEmpty(setSelectedRowKeys) && (
            <>
              <Divider style={{ margin: 0, color: 'red' }} />

              <label className="optionTitle">{t('view.storage.event')}</label>

              <Row gutter={24} style={{ margin: '5px' }}>
                <Col span={24}>
                  <Table
                    className="table__list--event mt-2"
                    rowKey="uuid"
                    columns={eventColumns}
                    // showHeader={false}
                    pagination={false}
                    dataSource={eventList}
                    rowSelection={rowSelection}
                  />
                </Col>
              </Row>
            </>
          )}
        </Form>
      </div>
    </div>
  );
}

async function fetchSelectOptions() {
  const data = {
    name: ''
  };
  const provinces = await AddressApi.getAllProvinces();
  const eventTypes = await EventApi.getAllEvent(data);
  const fields = await FieldApi.getAllFeild(data);

  return {
    provinces,
    eventTypes,
    fields
  };
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    changeTitle: (title) => {
      dispatch(changeTitle(title));
    },
    changeChart: (data) => {
      dispatch(changeChart(data));
    },
    changeCount: (count) => {
      dispatch(changeCount(count));
    },
    callData: (params) => {
      dispatch(loadDataChart(params));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);


