import { EditOutlined, PlusOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Tabs, Row, Col, Form, Input, Table, Space , Popconfirm} from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Timeline from "react-calendar-timeline/lib";
import 'react-calendar-timeline/lib/Timeline.css';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { reactLocalStorage } from "reactjs-localstorage";
import AIConfigScheduleApi from '../../actions/api/ai-config/AIConfigScheduleApi';
import AIConfigRectApi from '../../actions/api/ai-config/AIConfigRectApi';
import CameraApi from '../../actions/api/camera/CameraApi';
import ModalEditScheduleConfig from './ModalEditScheduleConfig';
import ModalScheduleConfigCopy from './ModalScheduleConfigCopy';
import './TabSchedule.scss';
import imagePoster from "../../assets/event/videoposter.png";
import { bodyStyleCard, headStyleCard } from './variables';


const { TabPane } = Tabs;

const CheckboxGroup = Checkbox.Group;





const TabSchedule = (props) => {
  const { cameraUuid, type } = props
  const { t } = useTranslation();
  const language = reactLocalStorage.get('language');
  const [selectedHumansId, setSelectedHumansId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalCopy, setShowModalCopy] = useState(false);
  const [total, setTotal] = useState(0);
  const [checkStatus, setCheckStatus] = useState(false);
  const [listCameras, setListCameras] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listDetail, setListDetail] = useState(10);
  const [listTimes, setListTimes] = useState([]);
  const [listTimesCN, setListTimesCN] = useState([]);
  const [listTimes2, setListTimes2] = useState([]);
  const [listTimes3, setListTimes3] = useState([]);
  const [listTimes4, setListTimes4] = useState([]);
  const [listTimes5, setListTimes5] = useState([]);
  const [listTimes6, setListTimes6] = useState([]);
  const [listTimes7, setListTimes7] = useState([]);
  const [data, setData] = useState({});
  const [selectDay, setSelectDay] = useState("");
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [checkedList, setCheckedList] = React.useState([]);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);
  const [dataRectList, setDataRectList] = React.useState([]);
  const [dataRect, setDataRect] = React.useState({});



  const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 24 },
  };

  const handleFocusInputNamePreset = (record) => {
    document.getElementById(`rename__preset-${record.key}`).style.display =
      "flex";
  };

  const handleFocusNamePresetTour = (e) => {
    document.getElementById("rename__preset-tour").style.display = "flex";
    document.getElementById("delete__preset-tour").style.display = "none";
  };

  const handleChangeTimeDelay = async (e, record) => {
    const value = e.target.value;
    // const datas = JSON.parse(JSON.stringify(presetTourDatas));
    // const index = datas[indexPresetTourChoosed].listPoint.findIndex(

    //   (item, index) => item.index == record.index
    // );
    // const data = datas[indexPresetTourChoosed].listPoint[index];
    // data.timeDelay = value;
    // datas[indexPresetTourChoosed].listPoint.splice(index, 1, data);

    // const body = {
    //   cameraUuid: idCamera,
    //   name: presetTourDatas[indexPresetTourChoosed].name,
    //   listPoint: datas[indexPresetTourChoosed].listPoint,
    //   idPresetTour: datas[indexPresetTourChoosed].idPresetTour,
    // };
    // try {
    //   const pload = await ptzControllerApi.postSetPresetTour(body);
    //   if (pload == null) {
    //     return;
    //   }
    //   setPresetTourDatas(datas);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const columnTables = [
    {
      title: 'No',
      dataIndex: 'no',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      render: (text, record) => {
        return (
          <>
            <input
              id={`input-name-preset-${record.key}`}
              defaultValue={record?.name}
              maxLength={20}
              onFocus={(e) => handleFocusInputNamePreset(record)}
              autoComplete="off"
              style={{width:'130px'}}
              className="ant-form-item-control-input"
            />
            <span
              id={`rename__preset-${record.key}`}
              style={{ display: "none" }}
            >
              {/* <CheckOutlined
                id={`confirm-done-icon-rename-${record.idPreset}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // handleDoneRenamePreset(e, record);
                }}
              />
              <CloseOutlined
                id={`confirm-close-icon-rename-${record.idPreset}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // handleCloseRenamePreset(e, record);
                }}
              /> */}
            </span>
          </>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      // render: (text, record) => {
      //   return (
      //     <div>
      //       <select
      //         defaultValue={record.status}
      //         onChange={(e) => handleChangeTimeDelay(e, record)}
      //       >
      //         <option value={0}>Không hoạt động</option>
      //         <option value={1}>Đang hoạt động</option>
      //       </select>
      //     </div>
      //   );
      // },
    },
    {
      className: 'action-1',
      title: () => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Button
              size="small"
              type="primary"
              className="ml-2 mr-2"
              onClick={onPlusConfigRect}
            >
              <PlusOutlined className="d-flex justify-content-between align-center" />
            </Button>
          </div>
        );
      },
      dataIndex: 'action',
      render: (_text, record) => {
        return (
          <Space>
            <Popconfirm
              title={t('noti.delete_category', { this: t('this') })}
              onConfirm={() => handleDelete(record.key)}
            >
              <DeleteOutlined style={{ fontSize: '16px', color: '#6E6B7B' }} />
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const dataTable = [];
  for (let i = 0; i < 4; i++) {
    dataTable.push({
      key: i,
      name: `Edward King ${i}`,
      no: 32,
      status: `London, ${i}`,
    });
  }



  const options = [
    { label: `${t('view.ai_config.human')}`, value: 'human' },
    { label: `${t('view.ai_config.vehicle')}`, value: 'vehicle' },
  ];

  useEffect(() => {

    const data = {
      page: page,
      pageSize: pageSize
    };
    CameraApi.getAllCamera(data).then((result) => {
      setListCameras(result);
    });
  }, []);

  useEffect(() => {
    const data = {
      type: type,
      cameraUuid: cameraUuid
    };
    AIConfigScheduleApi.getAllConfigSchedule(data).then((result) => {
      setData(result)
      setDefaultData(result)
    });

    AIConfigRectApi.getAllConfigRect(data).then((result) => {
      const itemRectList = [];
      let i = 1;
      result?.configRect && result.configRect.map(result => {
        itemRectList.push({
          key: i,
          name: result.name,
          no: result.lineNo,
          status: result.status,
        })
        i++;
      })
      setDataRectList(itemRectList)
    });


  }, [cameraUuid, type]);


  function setDefaultData(data) {
    const itemList = [];
    let i = 1;
    setListTimesCN(data?.sunday)
    data?.sunday && data.sunday.map(item => {
      const start = item.startTime * 1000
      const end = item.endTime * 1000
      itemList.push({
        id: i,
        group: 1,
        title: '',
        canMove: true,
        canResize: false,
        canChangeGroup: false,
        start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
        end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
      })
      i++
    })
    setListTimes2(data?.monday)
    data?.monday && data.monday.map(item => {
      const start = item.startTime * 1000
      const end = item.endTime * 1000
      itemList.push({
        id: i,
        group: 2,
        title: '',
        canMove: true,
        canResize: false,
        canChangeGroup: false,
        start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
        end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
      })
      i++
    })
    setListTimes3(data?.tuesday)
    data?.tuesday && data.tuesday.map(item => {
      const start = item.startTime * 1000
      const end = item.endTime * 1000
      itemList.push({
        id: i,
        group: 3,
        title: '',
        canMove: true,
        canResize: false,
        canChangeGroup: false,
        start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
        end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
      })
      i++
    })
    setListTimes4(data?.wednesday)
    data?.wednesday && data.wednesday.map(item => {
      const start = item.startTime * 1000
      const end = item.endTime * 1000
      itemList.push({
        id: i,
        group: 4,
        title: '',
        canMove: true,
        canResize: false,
        canChangeGroup: false,
        start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
        end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
      })
      i++
    })
    setListTimes5(data?.thursday)
    data?.thursday && data.thursday.map(item => {
      const start = item.startTime * 1000
      const end = item.endTime * 1000
      itemList.push({
        id: i,
        group: 5,
        title: '',
        canMove: true,
        canResize: false,
        canChangeGroup: false,
        start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
        end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
      })
      i++
    })
    setListTimes6(data?.friday)
    data?.friday && data.friday.map(item => {
      const start = item.startTime * 1000
      const end = item.endTime * 1000
      itemList.push({
        id: i,
        group: 6,
        title: '',
        canMove: true,
        canResize: false,
        canChangeGroup: false,
        start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
        end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
      })
      i++
    })
    setListTimes7(data?.saturday)
    data?.saturday && data.saturday.map(item => {
      const start = item.startTime * 1000
      const end = item.endTime * 1000
      itemList.push({
        id: i,
        group: 7,
        title: '',
        canMove: true,
        canResize: false,
        canChangeGroup: false,
        start_time: moment([2021, 1, 1, moment(start).get('hour'), moment(start).get('minute'), moment(start).get('second'), moment(start).get('millisecond')]),
        end_time: moment([2021, 1, 1, moment(end).get('hour'), moment(end).get('minute'), moment(end).get('second'), moment(end).get('millisecond')])
      })
      i++
    })
    setListDetail(itemList)
  }

  function onChangeCheckBox(val) {
    setCheckStatus(val.target.checked)
  }

  const getTimeLong = (start_m, end_m) => {
    if (start_m && end_m) {
      const start = moment([2021, 1, 1, start_m.get('hour'), start_m.get('minute'), start_m.get('second'), start_m.get('millisecond')])
      const end = moment([2021, 1, 1, end_m.get('hour'), end_m.get('minute'), end_m.get('second'), end_m.get('millisecond')])
      return {
        startTime: start.unix(),
        endTime: end.unix()
      }
    }

  }

  const handleSubmit = async () => {
    const status = "off"
    if (checkStatus) {
      status = "on"
    }
    const payload = {
      ...data,
      type: type,
      cameraUuid: cameraUuid,
      status: status
    };
    try {
      let isPost = await AIConfigScheduleApi.addConfigSchedule(payload);

      if (isPost) {
        const notifyMess = {
          type: 'success',
          title: `${t('noti.success')}`,
          description: 'Bạn đã config thành công',
        };
        Notification(notifyMess);
        setShowModal(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: changableRowKeys => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          this.setState({ selectedRowKeys: newSelectedRowKeys });
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: changableRowKeys => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          this.setState({ selectedRowKeys: newSelectedRowKeys });
        },
      },
    ],
  };


  const handleCreateTimeConfig = (values) => {
    let data2 = data;
    const itemList = [];

    if (values.start_1 && values.end_1) { itemList.push(getTimeLong(values.start_1, values.end_1)) }
    if (values.start_2 && values.end_2) { itemList.push(getTimeLong(values.start_2, values.end_2)) }
    if (values.start_3 && values.end_3) { itemList.push(getTimeLong(values.start_3, values.end_3)) }
    if (values.start_4 && values.end_4) { itemList.push(getTimeLong(values.start_4, values.end_4)) }

    if (values.checkAll) {
      data2.sunday
        = data2.saturday
        = data2.monday
        = data2.tuesday
        = data2.wednesday
        = data2.thursday
        = data2.friday
        = data2.saturday
        = itemList
    } else {
      switch (selectDay) {

        case 'CN':
          data2.sunday = itemList
          break
        case '2':
          data2.monday = itemList
          break
        case '3':
          data2.tuesday = itemList
          break
        case '4':
          data2.wednesday = itemList
          break
        case '5':
          data2.thursday = itemList
          break
        case '6':
          data2.friday = itemList
          break
        case '7':
          data2.saturday = itemList
          break
        default:
      }
    }
    setShowModal(false);
    setData(data2)
    setDefaultData(data2)
  };

  const onChange = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < options.length);
    setCheckAll(list.length === options.length);
  };

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? options : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onPlusConfigRect = e => {
    let dataNew = [...dataRectList]
    
    dataNew.push({
      key: dataRectList.length + 1,
      name: "Khu vực " + (dataRectList.length + 1),
      no: dataRectList.length + 1,
      status: "active",
      threshold: 0,
    })

    setDataRectList(dataNew);
    
  };

  const handleDelete = async (id) => {
    let newData = [...dataRectList];
    if (newData !== undefined && newData !== null && newData.length > 0) {
      newData = newData.filter(item => item.key !== id);
      setDataRectList(newData);
    } else {
      setDataRectList([]);
    }
   
  };


  const handleRowClick = (event, data) => {
    console.log("data   :", data)
    console.log(dataRectList)
    setDataRect(data)
  };




  const groups = [
    {
      id: 1, title: 'Chủ nhật', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setSelectDay("CN")
          if (!listTimesCN) {
            const defaultList = [];
            defaultList.push({
              startTime: 1609434000,
              endTime: 1609434000
            })
            setListTimes(defaultList)
          } else {
            setListTimes(listTimesCN)
          }
          setShowModal(true);
        }}
      />,
    },
    {
      id: 2, title: 'Thứ hai', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setSelectDay("2")
          if (!listTimes2) {
            const defaultList = [];
            defaultList.push({
              startTime: 1609434000,
              endTime: 1609434000
            })
            setListTimes(defaultList)
          } else {
            setListTimes(listTimes2)
          }
          setShowModal(true);
        }}
      />,
    },
    {
      id: 3, title: 'Thứ ba', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setSelectDay("3")
          if (!listTimes3) {
            const defaultList = [];
            defaultList.push({
              startTime: 1609434000,
              endTime: 1609434000
            })
            setListTimes(defaultList)
          } else {
            setListTimes(listTimes3)
          }
          setShowModal(true);
        }}
      />,
    },
    {
      id: 4, title: 'Thứ tư', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setSelectDay("4")
          if (!listTimes4) {
            const defaultList = [];
            defaultList.push({
              startTime: 1609434000,
              endTime: 1609434000
            })
            setListTimes(defaultList)
          } else {
            setListTimes(listTimes4)
          }
          setShowModal(true);
        }}
      />,
    },
    {
      id: 5, title: 'Thứ năm', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setSelectDay("5")
          if (!listTimes5) {
            const defaultList = [];
            defaultList.push({
              startTime: 1609434000,
              endTime: 1609434000
            })
            setListTimes(defaultList)
          } else {
            setListTimes(listTimes5)
          }
          setShowModal(true);
        }}
      />,
    },
    {
      id: 6, title: 'Thứ sáu', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setSelectDay("6")
          if (!listTimes6) {
            const defaultList = [];
            defaultList.push({
              startTime: 1609434000,
              endTime: 1609434000
            })
            setListTimes(defaultList)
          } else {
            setListTimes(listTimes6)
          }
          setShowModal(true);
        }}
      />,
    },
    {
      id: 7, title: 'Thứ bảy', bgColor: 'white', rightTitle: <EditOutlined
        style={{ fontSize: '16px', color: '#6E6B7B' }}
        onClick={() => {
          setSelectDay("7")
          if (!listTimes7) {
            const defaultList = [];
            defaultList.push({
              startTime: 1609434000,
              endTime: 1609434000
            })
            setListTimes(defaultList)
          } else {
            setListTimes(listTimes7)
          }

          setShowModal(true);
        }}
      />,
    },
  ]

  return (
    <div className="tabs__container--device">
      <div className="activate">
        <Checkbox onChange={onChangeCheckBox} checked={checkStatus}>{t('view.ai_config.activate_' + type)}</Checkbox>
      </div>

      <Card
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--category"
      // headStyle={{ padding: 30 }}
      >
        <div className="" >
          <Tabs type="card" >
            <TabPane tab={t('view.ai_config.area_config')} key="2">
              <Row gutter={24}>
                <Col span={12}>
                  <div style={{ width: '90%', padding: '20px' }}>
                    <img
                      style={{ width: '100%' }}
                      className='iconPoster'
                      src={`${imagePoster}`}
                      alt=""
                    />

                    <div className="">

                      <Button
                        onClick={() => {
                          handleSubmit();
                        }}
                        type="primary" htmlType="submit ">
                        {t('view.ai_config.apply')}
                      </Button>
                      <Button

                        type="primary"
                        onClick={() => {
                          setShowModalCopy(true);
                        }}
                      >
                        {t('view.ai_config.config_copy')}
                      </Button>
                    </div>

                    <Form
                      className='bg-grey'
                      form={form}
                      {...formItemLayout}
                      onFinish={handleSubmit}
                      initialValues={dataRect}
                    >

                      <Row gutter={24} style={{ marginTop: "20px" }}>
                        <Col span={12} style={{ flex: 'none' }}>
                          <p className="threshold">{t('view.ai_config.time_threshold')}</p>
                        </Col>
                        <Col span={6} style={{ flex: 'none' }}>
                          <Form.Item
                            name={["threshold"]}
                            rules={[
                            ]}
                          >
                            <Input placeholder="Số" type='threshold' />
                          </Form.Item>
                        </Col>
                        <Col span={6} style={{ flex: 'none' }}>
                          <p className="threshold">{t('view.ai_config.second')}</p>
                        </Col>

                      </Row>
                      <Row gutter={24} style={{ marginTop: "20px" }}>
                        <div className="">
                          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                            {t('view.ai_config.object_recognition')}
                          </Checkbox>
                          <CheckboxGroup options={options} value={checkedList} onChange={onChange} />
                        </div>
                      </Row>
                    </Form>
                  </div>
                </Col>
                <Col span={12} >
                  <div style={{ width: '100%', padding: '20px' }}>
                    <Table 
                    className="table__config_rect"
                    rowSelection={rowSelection} 
                    columns={columnTables} 
                    dataSource={dataRectList} 
                    onRow={(record, recordIndex) => {
                      return {
                        onClick: event => {
                          handleRowClick(event, record);
                        },
                      };
                    }}
                    />;
                  </div>
                </Col>
              </Row>
              {cameraUuid ?
                <div className="footer__modal">

                  <Button
                    onClick={() => {
                      handleSubmit();
                    }}
                    type="primary" htmlType="submit ">
                    {t('view.ai_config.apply')}
                  </Button>
                </div> : null
              }
            </TabPane>
            <TabPane tab={t('view.ai_config.schedule_config')} key="1">
              <Timeline
                style={{ color: 'white', marginTop: '20px', marginBottom: '20px' }}
                groups={groups}
                items={listDetail}
                defaultTimeStart={moment([2021, 1, 1, 0, 0, 0, 0])}
                defaultTimeEnd={moment([2021, 1, 1, 23, 59, 59, 999])}
                visibleTimeStart={moment([2021, 1, 1, 0, 0, 0, 0])}
                visibleTimeEnd={moment([2021, 1, 1, 23, 59, 59, 999])}
                rightSidebarWidth={30}
                minZoom={moment([2021, 1, 1, 0, 0, 0, 0])}
                maxZoom={moment([2021, 1, 1, 23, 59, 59, 999])}
                sidebarWidth={80}
                useResizeHandle={false}
              />
              {cameraUuid ?
                <div className="footer__modal">

                  <Button
                    onClick={() => {
                      handleSubmit();
                    }}
                    type="primary" htmlType="submit ">
                    {t('view.ai_config.apply')}
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      setShowModalCopy(true);
                    }}
                  >
                    {t('view.ai_config.config_copy')}
                  </Button>
                </div> : null
              }

            </TabPane>
          </Tabs>
        </div>

      </Card>
      {showModal &&
        <ModalEditScheduleConfig
          listTimes={listTimes}
          selectedHumansId={selectedHumansId}
          setShowModal={setShowModal}
          handleCreateTimeConfig={handleCreateTimeConfig}
        />
      }
      {showModalCopy &&
        <ModalScheduleConfigCopy
          type={type}
          cameraUuid={cameraUuid}
          setShowModalCopy={setShowModalCopy}
          handleCreateTimeConfig={handleCreateTimeConfig}
        />
      }
    </div>
  );
};

export default withRouter(TabSchedule);
