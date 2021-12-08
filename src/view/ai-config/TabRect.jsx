import { PlusOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Button, Card, Checkbox, Row, Col, Form, Input, Table, Space,
  Popconfirm, Spin, Tooltip, Switch, Select
} from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useRef, useState } from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import { useTranslation } from 'react-i18next';
import { reactLocalStorage } from "reactjs-localstorage";
import AIConfigRectApi from '../../actions/api/ai-config/AIConfigRectApi';
import './TabRect.scss';
import imagePoster from "../../assets/event/videoposter.png";
import { bodyStyleCard, headStyleCard } from './variables';
import Notification from "../../components/vms/notification/Notification";
import { NOTYFY_TYPE } from "../common/vms/Constant";
import getServerCamproxyForPlay from "../../utility/vms/camera";
import playCamApi from "../../api/camproxy/cameraApi";
import _ from "lodash";

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

const TabRect = (props) => {
  const { cameraUuid, type } = props
  const { t } = useTranslation();
  const language = reactLocalStorage.get('language');
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [checkedList, setCheckedList] = React.useState([]);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);
  const [dataRectList, setDataRectList] = React.useState([]);
  const [dataRect, setDataRect] = React.useState({});
  const [directionV, setDirectionV] = React.useState("");
  const [threshold, setThreshold] = React.useState(0);
  const [keyActive, setKeyActive] = React.useState(0);
  

  const canvasRef = useRef(null);
  let fromX = 0, fromY = 0, toX = 0, toY = 0, direction = 2;
  let isFromPointMouseDown = false;
  let isToPointMouseDown = false;
  let timerIdentifier = null;

  const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 24 },
  };

  const handleFocusInputNamePreset = (record) => {
    document.getElementById(`rename__preset-${record.key}`).style.display =
      "flex";
  };

  const handleSubmit = () => {
  }

  const onChangeTimeTypeTwo = (value) => {
    setDirectionV(value)
    // //create data
    // let configCleanFileNew = cleanSettingData.configCleanFile;
    // configCleanFileNew[2].timeType = value;

    // //set clean setting data
    // setCleanSettingData({
    //   ...cleanSettingData,
    //   configCleanFile: configCleanFileNew,
    // });
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
                defaultChecked={record.status === 1}
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

      playCameraOnline(cameraUuid).then(r => {
      });
      return () => {
        closeCamera();
      }
    }
  }, [cameraUuid, type]);

  

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
    if (newData.length > 0) {
      newData = newData.filter(item => item.key !== id);
      setDataRectList(newData);
    } else {
      setDataRectList([]);
    }
  };

  const handleRowClick = (event, data) => {
    console.log("data   :", data)
    setDataRect(data)
    setThreshold(2)
    setKeyActive(data.key)
    console.log("dataRect   :", dataRect)

  };

  const playCameraOnline = async (cameraUuid) => {
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
    pc.oniceconnectionstatechange = () => {
    };
    const spin = document.getElementById("spin-slot");
    pc.ontrack = (event) => {
      //binding and play
      const video = document.getElementById("video-slot");
      if (video) {
        video.srcObject = event.streams[0];
        video.autoplay = true;
        video.controls = false;
        video.style = "width:100%;height:100%;display:block;object-fit:cover;";
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
              pc.setRemoteDescription(res).then((r) => {
              });
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
      .finally(() => {
      });
  };

  const closeCamera = () => {
    const video = document.getElementById("video-slot");
    video.srcObject = null;
    video.style.display = "none";
    if (timerIdentifier != null) clearTimeout(timerIdentifier);
    window.removeEventListener('resize', resizeEventHandler);
  };

  const initLine = (initDirection) => {
    if (timerIdentifier != null) clearTimeout(timerIdentifier);
    const video = document.getElementById("video-slot");
    const canvas = document.getElementById("canvas-slot");
    if (canvas !== null) {
      canvas.style.display = "block";
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      fromX = video.clientWidth / 2;
      fromY = video.clientHeight / 4;
      toX = video.clientWidth / 2;
      toY = (video.clientHeight / 4) * 3;
      direction = initDirection;
      drawLine();
      window.addEventListener('resize', resizeEventHandler);
    }
  }

  const clearEventHandler = () => {
    const canvas = document.getElementById("canvas-slot");
    if (canvas !== null) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  const resizeEventHandler = (event) => {
    const video = document.getElementById("video-slot");
    const canvas = document.getElementById("canvas-slot");
    if (canvas !== null) {
      if (timerIdentifier != null) clearTimeout(timerIdentifier);
      timerIdentifier = setTimeout(() => {
        fromX = video.clientWidth * fromX / canvas.width;
        fromY = video.clientHeight * fromY / canvas.height;
        toX = video.clientWidth * toX / canvas.width;
        toY = video.clientHeight * toY / canvas.height;
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
        drawLine();
      }, 100);
    }
  }

  const drawLine = () => {
    const canvas = document.getElementById("canvas-slot");
    if (canvas !== null) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.lineWidth = '1'; // width of the line
      ctx.strokeStyle = 'yellow'; // color of the line
      ctx.fillStyle = "red";
      ctx.font = "12px Arial";
      ctx.lineJoin = ctx.lineCap = "round";

      // Base line
      ctx.moveTo(fromX, fromY); // begins a new sub-path based on the given x and y values.
      ctx.lineTo(toX, toY); // used to create a pointer based on x and y

      // Line number
      if (fromX < toX) {
        if (fromY < toY) {
          ctx.fillText("#1#", fromX - 15, fromY - 10);
        } else {
          ctx.fillText("#1#", fromX - 15, fromY + 20);
        }
      } else {
        if (fromY < toY) {
          ctx.fillText("#1#", fromX + 5, fromY - 10);
        } else {
          ctx.fillText("#1#", fromX + 5, fromY + 20);
        }
      }

      // Rect at two points of line
      let fRectX;
      let fRectY = 0;
      let tRectX;
      let tRectY = 0;
      if (fromX < toX) {
        fRectX = fromX - 5;
        tRectX = toX;
        if (fromY < toY) {
          fRectY = fromY - 5;
          tRectY = toY;
        } else if (fromY > toY) {
          fRectY = fromY;
          tRectY = toY - 5;
        } else {
          fRectY = fromY - 2.5;
          tRectY = toY - 2.5;
        }
      } else if (fromX > toX) {
        fRectX = fromX;
        tRectX = toX - 5;
        if (fromY < toY) {
          fRectY = fromY - 5;
          tRectY = toY;
        } else if (fromY > toY) {
          fRectY = fromY;
          tRectY = toY - 5;
        } else {
          fRectY = fromY - 2.5;
          tRectY = toY - 2.5;
        }
      } else { //fromX == toX
        fRectX = fromX - 2.5;
        tRectX = toX - 5;
        if (fromY < toY) {
          fRectY = fromY - 5;
          tRectY = toY;
        } else if (fromY > toY) {
          fRectY = fromY;
          tRectY = toY - 5;
        }
      }
      ctx.fillRect(fRectX, fRectY, 5, 5);
      ctx.fillRect(tRectX, tRectY, 5, 5);

      // Draw A,B arrow
      drawDirectionLine(ctx);

      ctx.stroke(); // this is where the actual drawing happens.
    }
  }

  const drawDirectionLine = (ctx) => {
    const dirLineLen = 30; // length of direction line
    let px = fromY - toY; // as vector at 90 deg to the line
    let py = toX - fromX;
    const len = dirLineLen / Math.hypot(px, py);
    px *= len;  // make length 50 pixels
    py *= len;

    // Get middle point of base line
    const middleX = (fromX + toX) / 2;
    const middleY = (fromY + toY) / 2;

    // Draw direction line
    ctx.moveTo(middleX + px, middleY + py);
    ctx.lineTo(middleX - px, middleY - py);

    // Draw arrow at headers of line
    let fX = 0, fY = 0, tX = 0, tY = 0;
    switch (direction) {
      case 0: // B -> A
        fX = middleX + px;
        fY = middleY + py;
        tX = middleX - px;
        tY = middleY - py;
        break;
      case 1: // A -> B
        fX = middleX - px;
        fY = middleY - py;
        tX = middleX + px;
        tY = middleY + py;
        break;
      case 2: // B <-> A
        fX = middleX + px;
        fY = middleY + py;
        tX = middleX - px;
        tY = middleY - py;
        break;
    }

    const headLen = 10; // length of head arrow
    let dx = fX - tX;
    let dy = fY - tY;
    let angle = Math.atan2(dy, dx);

    ctx.moveTo(fX, fY);
    if (direction === 2) { // B <-> A
      ctx.lineTo(fX - headLen * Math.cos(angle - Math.PI / 6), fY - headLen * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(fX, fY);
      ctx.lineTo(fX - headLen * Math.cos(angle + Math.PI / 6), fY - headLen * Math.sin(angle + Math.PI / 6));
      ctx.moveTo(fX, fY);
    }
    ctx.moveTo(tX, tY);
    dx = tX - fX;
    dy = tY - fY;
    angle = Math.atan2(dy, dx);
    ctx.lineTo(tX - headLen * Math.cos(angle - Math.PI / 6), tY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tX, tY);
    ctx.lineTo(tX - headLen * Math.cos(angle + Math.PI / 6), tY - headLen * Math.sin(angle + Math.PI / 6));

    if (fX < tX) {
      ctx.fillText("B", fX - 15, fY);
      ctx.fillText("A", tX + 5, tY);
    } else {
      ctx.fillText("B", fX + 5, fY);
      ctx.fillText("A", tX - 15, tY);
    }
  }

  const canvasMouseDown = (event) => {
    const position = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - position.left;
    const y = event.clientY - position.top;
    if (x <= (fromX + 10) && x >= (fromX - 10)
      && y <= (fromY + 10) && y >= (fromY - 10)) {
      canvasRef.current.style.cursor = "grabbing";
      isFromPointMouseDown = true;
    }
    if (x <= (toX + 10) && x >= (toX - 10)
      && y <= (toY + 10) && y >= (toY - 10)) {
      canvasRef.current.style.cursor = "grabbing";
      isToPointMouseDown = true;
    }
    event.preventDefault();
  }

  const canvasMouseUp = (event) => {
    const position = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - position.left;
    const y = event.clientY - position.top;
    if ((x <= (fromX + 10) && x >= (fromX - 10) && y <= (fromY + 10) && y >= (fromY - 10))
      || (x <= (toX + 10) && x >= (toX - 10) && y <= (toY + 10) && y >= (toY - 10))) {
      canvasRef.current.style.cursor = "grab";
    } else {
      canvasRef.current.style.cursor = "default";
    }
    isFromPointMouseDown = false;
    isToPointMouseDown = false;
    event.preventDefault();
  }

  const canvasMouseMove = (event) => {
    const position = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - position.left;
    const y = event.clientY - position.top;
    if (!isFromPointMouseDown && !isToPointMouseDown) {
      if ((x <= (fromX + 10) && x >= (fromX - 10) && y <= (fromY + 10) && y >= (fromY - 10))
        || (x <= (toX + 10) && x >= (toX - 10) && y <= (toY + 10) && y >= (toY - 10))) {
        canvasRef.current.style.cursor = "grab";
      } else {
        canvasRef.current.style.cursor = "default";
      }
    }
    if (isFromPointMouseDown) {
      fromX = x;
      fromY = y;
      drawLine();
    }
    if (isToPointMouseDown) {
      toX = x;
      toY = y;
      drawLine();
    }
    event.preventDefault();
  }

  return (
    <div className="tabs__container--config_rect">
      <Card
        bodyStyle={bodyStyleCard}
        headStyle={headStyleCard}
        className="card--category"
      // headStyle={{ padding: 30 }}
      >
        <div className="">
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
                    <canvas id="canvas-slot" className="canvas-slot" ref={canvasRef}
                      onMouseUp={canvasMouseUp}
                      onMouseDown={canvasMouseDown} onMouseMove={canvasMouseMove}
                      width="100%" style={{ display: "none" }} />
                    <Spin
                      className="video-js"
                      size="large"
                      id="spin-slot"
                      style={{ display: "none" }}
                    />
                    <video
                      className="video-js"
                      width="100%"
                      autoPlay="1"
                      id="video-slot"
                      style={{ display: "none" }}
                    >
                      Trình duyệt không hỗ trợ thẻ video.
                    </video>
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center"
                  style={{ marginTop: "20px" }}>
                  <Button
                    onClick={() => {
                      initLine(2);
                    }}
                    type="primary" htmlType="submit ">
                    {t('view.ai_config.draw.' + type)}
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      clearEventHandler();
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
                  {type == "intrusion_detection" ?
                    <Row gutter={24} style={{ marginTop: "20px" }}>
                      <Col span={12} style={{ flex: 'none' }}>
                        <p className="threshold">{t('view.ai_config.time_threshold')}</p>
                      </Col>
                      <Col span={6} style={{ flex: 'none' }}>
                        <Form.Item
                          name={["threshold"]}
                          rules={[]}
                          vale={threshold}

                        >
                          <Input placeholder="Số" type='threshold' value={threshold} />
                        </Form.Item>
                      </Col>
                      <Col span={6} style={{ flex: 'none' }}>
                        <p className="threshold">{t('view.ai_config.second')}</p>
                      </Col>
                    </Row> : <Row gutter={24} style={{ marginTop: "20px" }}>
                      <Col span={12} style={{ flex: 'none' }}>
                        <p className="threshold">{t('view.ai_config.direction.title')}</p>
                      </Col>
                      <Col span={12} style={{ flex: 'none' }}>
                      <div className="select-direction">
                        <Select
                          onChange={onChangeTimeTypeTwo}
                          value={directionV}
                        >
                          <Option value='AB'>{t('view.ai_config.direction.AB')}</Option>
                          <Option value='BA'>{t('view.ai_config.direction.BA')}</Option>
                        </Select></div>
                        
                      </Col>

                    </Row>
                  }

                  <Row gutter={24} style={{ marginTop: "20px" }}>
                    <div className="">
                      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange}
                        checked={checkAll}>
                        {t('view.ai_config.object_recognition')}
                      </Checkbox>
                      <CheckboxGroup options={options} value={checkedList} onChange={onChange} />
                    </div>
                  </Row>
                </Form>
              </div>
            </Col>
            <Col span={12}>
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
  return _.isEqual(prevTabRect.cameraUuid, nextTabRect.cameraUuid) && _.isEqual(prevTabRect.type, nextTabRect.type)

  ;
}

export const MemoizedTabRect = React.memo(TabRect, tabRectPropsAreEqual);
