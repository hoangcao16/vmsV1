import { EditOutlined, PlusOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Tabs, Row, Col, Form, Input, Table, Space, 
  Popconfirm, Spin, Tooltip, Switch } from 'antd';
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
import './TabRect.scss';
import imagePoster from "../../assets/event/videoposter.png";
import { bodyStyleCard, headStyleCard } from './variables';
import Notification from "../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../common/vms/Constant";
import getServerCamproxyForPlay from "../../utility/vms/camera";
import playCamApi from "../../api/camproxy/cameraApi";
import _ from "lodash";


const { TabPane } = Tabs;

const CheckboxGroup = Checkbox.Group;





const TabRect = (props) => {
  const { cameraUuid, type } = props
  const { t } = useTranslation();
  const language = reactLocalStorage.get('language');
  const [showModal, setShowModal] = useState(false);
  const [showModalCopy, setShowModalCopy] = useState(false);
  const [total, setTotal] = useState(0);
  const [checkStatus, setCheckStatus] = useState(false);
  const [data, setData] = useState({});
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

  const handleUpdateStatus = async (e, uuid) => {
    let status;
    if (e) {
      status = 1;
    } else {
      status = 0;
    }

    // await UserApi.update({ uuid: uuid, status: status });
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
              style={{ width: '130px' }}
              className="ant-form-item-control-input"
            />
            <span
              id={`rename__preset-${record.key}`}
              style={{ display: "none" }}
            >
            </span>
          </>
        );
      },
    },
    {
      title: `${t('view.user.detail_list.user_status')}`,
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <Space>
            <Tooltip
              placement="top"
              title={t('view.user.detail_list.change_status')}
            >
              <Switch
                defaultChecked={record.status === 1 ? true : false}
                onChange={(e) => handleUpdateStatus(e, record.uuid)}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                // disabled={!permissionCheck('deactivate_user')}
              />
            </Tooltip>
          </Space>
        );
      }
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

  console.log(">>>>> cameraUuid: ", cameraUuid);

  const options = [
    { label: `${t('view.ai_config.human')}`, value: 'human' },
    { label: `${t('view.ai_config.vehicle')}`, value: 'vehicle' },
  ];

  useEffect(() => {
    playCameraOnline(cameraUuid).then(r => { });
    return () => {
      closeCamera();
    }
  }, []);

  useEffect(() => {
    if (cameraUuid != null && cameraUuid !== "") {
      const data = {
        type: type,
        cameraUuid: cameraUuid
      };

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
    }



  }, [cameraUuid, type]);

  const handleSubmit = async () => {
    const status = "off"
    // if (checkStatus) {
    //   status = "on"
    // }
    const rectList = [];
    dataRectList.map(result => {
      rectList.push({
        key: result.key,
        name: document.getElementById(`input-name-preset-${result.key}`).value,
        no: result.lineNo,
        status: result.status,
        // status: result.status,
      })
    })
    console.log("checlisst :" , checkedList  )
    const payload = {
      ...data,
      type: type,
      cameraUuid: cameraUuid,
      status: status
    };

  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
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
    
    setDataRect(data)
    console.log("dataRect   :", dataRect)
  };


  const playCameraOnline = async (cameraUuid) => {
    console.log(">>>>> Play camera: ", cameraUuid);
    if (cameraUuid === "" || cameraUuid == null) {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: "Xem trực tiếp",
        description: "Camera không xác định",
      });
      return;
    }
    const data = await getServerCamproxyForPlay(cameraUuid);
    if (data == null) {
      Notification({
        type: NOTYFY_TYPE.warning,
        title: "Xem trực tiếp",
        description: "Không nhận địa chỉ camproxy lỗi",
      });
      return;
    }

    const pc = new RTCPeerConnection();
    pc.addTransceiver("video");
    pc.oniceconnectionstatechange = () => { };
    const spin = document.getElementById("spin-slot-1");
    pc.ontrack = (event) => {
      //binding and play
      const cell = document.getElementById("ptz-slot");
      if (cell) {
        cell.srcObject = event.streams[0];
        cell.autoplay = true;
        cell.controls = false;
        cell.style = "width:100%;height:100%;display:block;object-fit:cover;";
        spin.style.display = "none";
      }
    };
    const token = "123";
    const API = data.camproxyApi;

    pc.createOffer({
      iceRestart: false,
    })
      .then((offer) => {
        spin.style.display = "block";
        pc.setLocalDescription(offer);
        //call api
        playCamApi
          .playCamera(API, {
            token: token,
            camUuid: cameraUuid,
            offer: offer,
          })
          .then((res) => {
            if (res) {
              pc.setRemoteDescription(res).then((r) => { });
            } else {
              spin.style.display = "none";
              Notification({
                type: NOTYFY_TYPE.warning,
                title: "Xem trực tiếp",
                description: "Nhận offer từ server bị lỗi",
              });
            }
          });
      })
      .catch((error) => {
        spin.style.display = "none";
      })
      .catch(alert)
      .finally(() => { });
  };

  const closeCamera = () => {
    console.log(">>>>> Close camera: ", cameraUuid);
    const cell = document.getElementById("ptz-slot");
    cell.srcObject = null;
    cell.style.display = "none";
  };

  return (
    <div className="tabs__container--config_rect">
      <Card
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--category"
      // headStyle={{ padding: 30 }}
      >
        <div className="" >
          <Row gutter={24}>
            <Col span={12}>
              <div style={{ width: '90%', padding: '20px' }}>
                {!cameraUuid && (<img
                  style={{ width: '100%' }}
                  className='iconPoster'
                  src={`${imagePoster}`}
                  alt="" />)
                }
                {cameraUuid && (
                  <div className="camera__monitor">
                    <Space size="middle">
                      <Spin
                        className="video-js"
                        size="large"
                        id="spin-slot-1"
                        style={{ display: "none" }}
                      />
                    </Space>
                    <video
                      className="video-js"
                      width="100%"
                      autoPlay="1"
                      id="ptz-slot"
                      style={{ display: "none" }}
                    >
                      Trình duyệt không hỗ trợ thẻ video.
                    </video>
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "20px" }}>

                  <Button
                    onClick={() => {
                      handleSubmit();
                    }}
                    type="primary" htmlType="submit ">
                    {t('view.ai_config.draw.' + type)}
                  </Button>
                  <Button

                    type="primary"
                    onClick={() => {
                      setShowModalCopy(true);
                    }}
                  >
                    {t('view.ai_config.delete.' + type)}
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
                  pagination={false}
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
        </div>

      </Card>
    </div>
  );
};

function tabRectPropsAreEqual(prevTabRect, nextTabRect) {
  return _.isEqual(prevTabRect.cameraUuid, nextTabRect.cameraUuid) && _.isEqual(prevTabRect.type, nextTabRect.type);
}

export const MemoizedTabRect = React.memo(TabRect, tabRectPropsAreEqual);
