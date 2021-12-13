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
  const [threshold, setThreshold] = React.useState(0);
  const [keyActive, setKeyActive] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [isActiveDetail, setIsActiveDetail] = React.useState(false);
  let coordinates = [];

  const canvasRef = useRef(null);
  const canvasRefRect = useRef(null);
  let fromX = 0, fromY = 0, toX = 0, toY = 0, direction = 2;
  let isFromPointMouseDown = false;
  let isToPointMouseDown = false;
  let timerIdentifier = null;
  let timerIdentifierRect = null;
  let videoSlotSize = {};
  let videoSlotSizeRect = {};

  const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 24 },
  };

  const handleDoneRenamePreset = async (e, record) => {
    const value = document
      .getElementById(`input-name-preset-${record.key}`)
      .value.trim();
    if (value.length >= 30 || value.length === 0) {
      //validate
      const warnNotyfi = {
        type: NOTYFY_TYPE.warning,
        title: "Thất bại",
        description: "Độ dài tên cần lớn hơn 0 nhỏ hơn 100 kí tự",
        duration: 2,
      };
      Notification(warnNotyfi);
      return;
    } else {
      const body = {
        cameraUuid: cameraUuid,
        type: type,
        name: value,
        uuid: record.uuid
      };

      try {
        AIConfigRectApi.editConfigRectName(body).then((result) => {
          let dataNew = [...dataRectList]
          dataNew.map((data, index) => {
            if (data.key === record.key) {
              data.uuid = result.uuid;
            }
          })

          setDataRectList(dataNew);
        });

        document.getElementById(
          `rename__preset-${record.key}`
        ).style.display = "none";
        const successNotyfi = {
          type: NOTYFY_TYPE.success,
          title: `${t("noti.success")}`,
          description: "Bạn đã đổi tên preset thành công",
          duration: 2,
        };
        Notification(successNotyfi);
      } catch (error) {
        const warnNotyfi = {
          type: NOTYFY_TYPE.warning,
          description: "Đã xảy ra lỗi",
          duration: 2,
        };
        Notification(warnNotyfi);
        console.log(error);
      }
    }
  };

  const handleFocusInputNamePreset = (record) => {
    document.getElementById(`rename__preset-${record.key}`).style.display =
      "flex";
  };


  const handleCloseRenamePreset = (e, record) => {
    e.stopPropagation();
    document.getElementById(`input-name-preset-${record.idPreset}`).value =
      dataRectList[record.key].name;
    document.getElementById(`rename__preset-${record.idPreset}`).style.display =
      "none";
  };

  const handleSubmit = async (value) => {
    
    const name = document
    .getElementById(`input-name-preset-${keyActive}`)
    .value.trim();
    const payload = {
      ...dataRect,
      type: type,
      cameraUuid: cameraUuid,
      peopleDetection: checkedList.includes('human'),
      vehicleDetection: checkedList.includes('vehicle'),
      threshold: value.threshold,
      status: "1",
      direction: value.direction,
      name: name,
      points: [[]]

    };
    let data = dataRect
    
    AIConfigRectApi.addConfigRect(payload).then((result) => {
      setDefaultDataRect(result)
    });
    
    
  };

  function setDefaultDataRect(data) {
    setDataRect(data)
    let checkList = []
    if (data.peopleDetection) {
      checkList.push("human")
    }
    if (data.vehicleDetection) {
      checkList.push("vehicle")
    }
    setCheckedList(checkList)
    form.setFieldsValue({
      threshold: 100,
      direction: data.direction
    })
  }

  const onChangeTimeTypeTwo = (value) => {
    // setDirectionV(value)
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
      dataIndex: 'lineNo',
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
              <CheckOutlined
                id={`confirm-done-icon-rename-${record.key}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDoneRenamePreset(e, record);
                }}
              />
              <CloseOutlined
                id={`confirm-close-icon-rename-${record.key}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseRenamePreset(e, record);
                }}
              />
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
        if (isActive) {
          return (
            <div style={{ textAlign: 'center' }}>
              <Button
                disabled={!isActive}
                size="small"
                type="primary"
                className="ml-2 mr-2"
                onClick={onPlusConfigRect}
              >
                <PlusOutlined className="d-flex justify-content-between align-center" />
              </Button>
            </div>
          );
        }

      },
      dataIndex: 'action',
      render: (_text, record) => {
        return (
          <Space>
            <Popconfirm
              title={t('noti.delete_category', { this: t('this') })}
              onConfirm={() => handleDelete(record)}
            >
              <DeleteOutlined style={{ fontSize: '16px', color: '#6E6B7B' }} />
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const options = [
    { label: `${t('view.ai_config.human')}`, value: 'human' },
    { label: `${t('view.ai_config.vehicle')}`, value: 'vehicle' },
  ];

  useEffect(() => {
  }, []);

  console.log("(1) >>>>> cameraUuid: ", cameraUuid, ", type: ", type);

  useEffect(() => {
    console.log("(2) >>>>> cameraUuid: ", cameraUuid, ", type: ", type);
    if (cameraUuid != null && cameraUuid !== "") {
      setIsActive(true)
      const data = {
        type: type,
        cameraUuid: cameraUuid
      };

      AIConfigRectApi.getAllConfigRect(data).then((result) => {
        const itemRectList = [];
        let i = 1;
        result?.configRect && result.configRect.map(result => {
          let date = Date.now();
          itemRectList.push({
            key: --date + i,
            uuid: result.uuid,
            name: result.name,
            lineNo: i,
            status: result.status,
            objectDetection: result.objectDetection,
            vehicleDetection: result.vehicleDetection,
            peopleDetection: result.peopleDetection,
            direction: result.direction,
            threshold: result.threshold
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
    const checkList = ["vehicle", "human"];
    setCheckedList(e.target.checked ? checkList : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);

  };

  const onPlusConfigRect = e => {
    let date = Date.now();
    let dataNew = [...dataRectList]
    let strType = ""
    if (type == "intrusion_detection") {
      strType = "Khu vực "
    }
    if (type == "hurdles") {
      strType = "Đường "
    }
    dataNew.push({
      key: --date,
      name: strType + (dataRectList.length + 1),
      lineNo: dataRectList.length + 1,
      status: "1",
      threshold: 0,
    })
    setDataRectList(dataNew);
  };

  const handleDelete = async (record) => {
    let newData = [...dataRectList];
    if (newData.length > 0) {
      newData = newData.filter(item => item.key !== record.key);
      if (record.uuid != null) {
        try {
          let isPost = await AIConfigRectApi.deleteConfigRect(record.uuid);

          if (isPost) {
            const notifyMess = {
              type: 'success',
              title: `${t('noti.success')}`,
              description: 'Bạn đã xóa thành công',
            };
            Notification(notifyMess);
          }
        } catch (error) {
          console.log(error);
        }
      }

      let i = 1
      newData.map((data, index) => {
        data.lineNo = i;
      })
      i++

      setDataRectList(newData);

    } else {
      setDataRectList([]);
    }
  };

  const handleRowClick = (event, data) => {
    setKeyActive(data.key)
    if(data.uuid != null){
      AIConfigRectApi.getConfigRect(data.uuid).then((result) => {
        if (result != null) {
          data = result
        }
      });
    }
    
    setDefaultDataRect(data)
    setIsActiveDetail(true)


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
    const spin = document.getElementById("spin-slot-"+type);
    pc.ontrack = (event) => {
      //binding and play
      const video = document.getElementById("video-slot-"+type);
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
    const video = document.getElementById("video-slot-"+type);
    video.srcObject = null;
    video.style.display = "none";
    if (timerIdentifier != null) clearTimeout(timerIdentifier);
    if (timerIdentifierRect != null) clearTimeout(timerIdentifierRect);
    window.removeEventListener('resize', resizeLineCanvasEventHandler);
    window.removeEventListener('resize', resizeRectCanvasEventHandler);
  };

  const initRect = () => {
    if (timerIdentifierRect != null) clearTimeout(timerIdentifierRect);
    const video = document.getElementById("video-slot-"+type);
    const canvas = document.getElementById("canvas-slot-"+type);
    if (canvas !== null) {
      canvas.style.display = "block";
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      videoSlotSizeRect = {w: video.clientWidth, h: video.clientHeight};
      coordinates = [];
      coordinates.push({x: video.clientWidth / 4, y: video.clientHeight / 4, mouseDown: false});
      coordinates.push({x: (video.clientWidth / 4) * 3, y: video.clientHeight / 4, mouseDown: false});
      coordinates.push({x: (video.clientWidth / 4) * 3, y: (video.clientHeight / 4) * 3, mouseDown: false});
      coordinates.push({x: video.clientWidth / 4, y: (video.clientHeight / 4) * 3, mouseDown: false});
      drawRect();
      window.addEventListener('resize', resizeRectCanvasEventHandler);
    }
  }

  const drawRect = () => {
    const canvas = document.getElementById("canvas-slot-"+type);
    if (canvas !== null) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = '1'; // width of the line
      ctx.strokeStyle = 'yellow'; // color of the line
      ctx.fillStyle = "red";
      ctx.font = "12px Arial";
      ctx.lineJoin = ctx.lineCap = "round";

      // Draw rect
      ctx.beginPath();
      ctx.moveTo(coordinates[0].x, coordinates[0].y);
      for (let index = 1; index < coordinates.length; index++) {
        ctx.lineTo(coordinates[index].x, coordinates[index].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Rect number
      ctx.fillText("#1#", coordinates[0].x - 15, coordinates[0].y - 10);

      // Rect at all points
      ctx.beginPath();
      for (let index = 0; index < coordinates.length; index++) {
        ctx.fillRect(coordinates[index].x - 2.5, coordinates[index].y - 2.5, 5, 5);
      }
      ctx.closePath();
    }
  }

  const initLine = (initDirection) => {
    if (timerIdentifier != null) clearTimeout(timerIdentifier);
    const video = document.getElementById("video-slot-"+type);
    const canvas = document.getElementById("canvas-slot-"+type);
    if (canvas !== null) {
      canvas.style.display = "block";
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      videoSlotSize = {w: video.clientWidth, h: video.clientHeight};
      fromX = video.clientWidth / 2;
      fromY = video.clientHeight / 4;
      toX = video.clientWidth / 2;
      toY = (video.clientHeight / 4) * 3;
      direction = initDirection;
      drawLine();
      window.addEventListener('resize', resizeLineCanvasEventHandler);
    }
  }

  const clearEventHandler = () => {
    const canvas = document.getElementById("canvas-slot-"+type);
    if (canvas !== null) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  const resizeLineCanvasEventHandler = (event) => {
    let video = document.getElementById("video-slot-hurdles");
    const canvas = document.getElementById("canvas-slot-hurdles");
    if (canvas !== null) {
      if (timerIdentifier != null) clearTimeout(timerIdentifier);
      let w = video.clientWidth, h = video.clientHeight;
      if (video.clientWidth === 0) { // In case video is not active
        video = document.getElementById("video-slot-intrusion_detection");
        w = video.clientWidth;
        h = video.clientHeight;
      }
      timerIdentifier = setTimeout(() => {
        fromX = w * fromX / canvas.width;
        fromY = h * fromY / canvas.height;
        toX = w * toX / canvas.width;
        toY = h * toY / canvas.height;
        canvas.width = w;
        canvas.height = h;
        drawLine();
      }, 100);
    }
  }

  const resizeRectCanvasEventHandler = (event) => {
    let video = document.getElementById("video-slot-intrusion_detection");
    const canvas = document.getElementById("canvas-slot-intrusion_detection");
    if (canvas !== null) {
      if (timerIdentifierRect != null) clearTimeout(timerIdentifierRect);
      let w = video.clientWidth, h = video.clientHeight;
      if (video.clientWidth === 0) { // In case video is not active
        video = document.getElementById("video-slot-hurdles");
        w = video.clientWidth;
        h = video.clientHeight;
      }
      timerIdentifierRect = setTimeout(() => {
        for (let index = 0; index < coordinates.length; index++) {
          let x = w * coordinates[index].x / canvas.width;
          let y = h * coordinates[index].y / canvas.height;
          coordinates[index] = {...coordinates[index], x: x, y: y};
        }
        canvas.width = w;
        canvas.height = h;
        drawRect();
      }, 100);
    }
  }

  const drawLine = () => {
    const canvas = document.getElementById("canvas-slot-"+type);
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
        tRectX = toX - 2.5;
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
    switch (type) {
      case "hurdles":
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
        break;
      case "intrusion_detection":
        const position_ = canvasRefRect.current.getBoundingClientRect();
        const x_ = event.clientX - position_.left;
        const y_ = event.clientY - position_.top;

        for (let index = 0; index < coordinates.length; index++) {
          if (x_ <= (coordinates[index].x + 10) && x_ >= (coordinates[index].x - 10)
              && y_ <= (coordinates[index].y + 10) && y_ >= (coordinates[index].y - 10)) {
            canvasRefRect.current.style.cursor = "grabbing";
            coordinates[index] = {...coordinates[index], mouseDown: true};
            break;
          }
        }
        break;
    }
    event.preventDefault();
  }

  const canvasMouseUp = (event) => {
    switch (type) {
      case "hurdles":
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
        break;
      case "intrusion_detection":
        const position_ = canvasRefRect.current.getBoundingClientRect();
        const x_ = event.clientX - position_.left;
        const y_ = event.clientY - position_.top;
        for (let index = 0; index < coordinates.length; index++) {
          coordinates[index] = {...coordinates[index], mouseDown: false};
          if (x_ <= (coordinates[index].x + 10) && x_ >= (coordinates[index].x - 10)
              && y_ <= (coordinates[index].y + 10) && y_ >= (coordinates[index].y - 10)) {
            canvasRefRect.current.style.cursor = "grab";
            break;
          }else{
            canvasRefRect.current.style.cursor = "default";
          }
        }
        break;
    }
    event.preventDefault();
  }

  const canvasMouseMove = (event) => {
    switch (type) {
      case "hurdles":
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
        break;
      case "intrusion_detection":
        const position_ = canvasRefRect.current.getBoundingClientRect();
        const x_ = event.clientX - position_.left;
        const y_ = event.clientY - position_.top;
        for (let index = 0; index < coordinates.length; index++) {
          if (!coordinates[index].mouseDown) {
            if (x_ <= (coordinates[index].x + 10) && x_ >= (coordinates[index].x - 10)
                && y_ <= (coordinates[index].y + 10) && y_ >= (coordinates[index].y - 10)) {
              canvasRefRect.current.style.cursor = "grab";
              break;
            } else {
              canvasRefRect.current.style.cursor = "default";
            }
          } else {
            coordinates[index] = {...coordinates[index], x: x_, y: y_};
          }
        }
        for (let index = 0; index < coordinates.length; index++) {
          if (coordinates[index].mouseDown){
            drawRect();
            break;
          }
        }
        break;
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
                    <canvas id={`canvas-slot-${type}`} className="canvas-slot" ref={type==="hurdles"?canvasRef:canvasRefRect}
                      onMouseUp={canvasMouseUp}
                      onMouseDown={canvasMouseDown} onMouseMove={canvasMouseMove}
                      width="100%" style={{ display: "none" }} />
                    <Spin
                      className="video-js"
                      size="large"
                      id={`spin-slot-${type}`}
                      style={{ display: "none" }}
                    />
                    <video
                      className="video-js"
                      width="100%"
                      autoPlay="1"
                      id={`video-slot-${type}`}
                      style={{ display: "none" }}
                    >
                      Trình duyệt không hỗ trợ thẻ video.
                    </video>
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center"
                  style={{ marginTop: "20px" }}>
                  <Button
                    disabled={!isActive}
                    onClick={() => {
                      if (type === "hurdles") {
                        initLine(2);
                      }else{
                        initRect();
                      }
                    }}
                    type="primary" htmlType="submit ">
                    {t('view.ai_config.draw.' + type)}
                  </Button>
                  <Button
                    disabled={!isActive}
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
                  {type === "intrusion_detection" ?
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
                          <Input disabled={!isActiveDetail} placeholder="Số" type='threshold' value={threshold} />
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
                          <Form.Item name={['direction']}>
                            <Select disabled={!isActiveDetail} onChange={(e) => onChangeTimeTypeTwo(e)}>
                              <Option value={1}>{t('view.ai_config.direction.AB')}</Option>
                              <Option value={0}>{t('view.ai_config.direction.BA')}</Option>
                              <Option value={2}>{t('view.ai_config.direction.All')}</Option>
                            </Select>
                          </Form.Item>
                        </div>

                      </Col>

                    </Row>
                  }

                  <Row gutter={24} style={{ marginTop: "20px" }}>
                    <Col span={24} style={{ flex: 'none' }}>
                      <div className="">
                        <Form.Item
                          name="checkedList">
                          <Checkbox disabled={!isActiveDetail} indeterminate={indeterminate} onChange={onCheckAllChange}
                            checked={checkAll}>
                            {t('view.ai_config.object_recognition')}
                          </Checkbox>
                          <CheckboxGroup disabled={!isActiveDetail} options={options} value={checkedList} onChange={onChange} />
                        </Form.Item>

                      </div>
                    </Col>

                  </Row>

                  {cameraUuid ?
                    <div className="footer__modal">
                      <Button
                        disabled={!isActiveDetail}
                        onClick={() => {
                        }}
                        type="primary" htmlType="submit ">
                        {t('view.ai_config.apply')}
                      </Button>
                    </div> : null
                  }
                </Form>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ width: '100%', padding: '20px' }}>
                <Table
                  className="table__config_rect"
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
