import React, { useState, useEffect } from 'react';
import { Row, Col, Popconfirm, Button, Space, Spin } from 'antd';
import { StyledEventFileDetail, ActionButton, VideoOverlay } from './style';
import { useTranslation } from 'react-i18next';
// import SelectType from "./select-type";
import './../../../commonStyle/commonPopconfirm.scss';
import { CloseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { MemoizedTableDetailList } from './tableDetailList';
import ExportEventFileApi from '../../../../actions/api/exporteventfile/ExportEventFileApi';

const Viewfiletype4 = ({
  detailAI,
  processState,
  imageOther,
  deleteImageHandler,
  viewImageAIHandler,
  handleShowTicketModal,
  tracingList,
  onClickRow,
  editNoteUpdate,
  onNext,
  currentEventTablePage,
  totalEventTablePage,
  listFiles,
}) => {
  const { t } = useTranslation();
  const AI_SOURCE = process.env.REACT_APP_AI_SOURCE;
  const [loading, setLoading] = useState(false);
  const [videoErrorURL, setVideoErrorURL] = useState(null);
  useEffect(() => {
    setVideoErrorURL(null);
  }, [detailAI]);
  const processingstatusOptions = [
    {
      value: 'process',
      label: `${t('view.ai_events.processing-status.process')}`,
    },
    {
      value: 'processed',
      label: `${t('view.ai_events.processing-status.processed')}`,
    },
    {
      value: 'not_processed',
      label: `${t('view.ai_events.processing-status.not_processed')}`,
    },
  ];
  // const hasImage = imageOther.find((item) => item.type === 'mp4');
  const hasVideo = detailAI?.videoUrl ? true : false;
  const isDisabled = () => {
    if (processState?.value === processingstatusOptions[2]?.value) {
      return true;
    }
    if (detailAI?.uuid === '') {
      return true;
    }
    return false;
  };
  const isNextDisabled = () => {
    const index = listFiles.findIndex((item) => {
      return item?.uuid === detailAI?.uuid;
    });
    if (detailAI?.uuid === '') {
      return true;
    }
    if (
      totalEventTablePage === currentEventTablePage &&
      index === listFiles.length - 1
    ) {
      return true;
    }
    return false;
  };
  const downloadVideo = async () => {
    if (!videoErrorURL) {
      setLoading(true);
      await ExportEventFileApi.downloadAIIntegrationFile(
        detailAI?.uuid,
        'Video.mp4'
      )
        .then(async (result) => {
          const blob = new Blob([result.data], { type: 'octet/stream' });
          setVideoErrorURL({
            id: 'video',
            type: 'mp4',
            fileName: 'Video.mp4',
            uuid: detailAI?.uuid,
            url: URL.createObjectURL(blob),
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <>
      <StyledEventFileDetail className='eventDetail4'>
        <Col span={14}>
          <div className='title'>{t('view.ai_events.err_image')}</div>
          <div className='err_image'>
            {AI_SOURCE !== 'philong' ? (
              <ul>
                {imageOther
                  ? imageOther.map((item, index) => (
                      <li
                        key={item.uuid}
                        style={{
                          listStyleType: 'none',
                          display: 'inline-block',
                          marginRight: '20px',
                        }}
                      >
                        <div style={{ width: '90%', paddingBottom: '10px' }}>
                          <div
                            className='img__item'
                            style={{ position: 'relative' }}
                          >
                            {item.uuid !== detailAI.uuid ? (
                              <Popconfirm
                                title={t('noti.sure_to_delete')}
                                onCancel={(event) => {
                                  event.stopPropagation();
                                }}
                                onConfirm={(event) => {
                                  event.stopPropagation();
                                  deleteImageHandler(item.uuid);
                                }}
                              >
                                <Button
                                  className='button-photo-remove'
                                  size='small'
                                  type='danger'
                                  onClick={(event) => {
                                    event.stopPropagation();
                                  }}
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '15px',
                                    height: '15px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'red',
                                    // padding: '15px'
                                  }}
                                >
                                  <CloseOutlined style={{}} />
                                </Button>
                              </Popconfirm>
                            ) : null}

                            <img
                              onClick={(event) => {
                                event.stopPropagation();
                                viewImageAIHandler(item);
                              }}
                              style={{ width: '120px', height: '120px' }}
                              className='cursor-pointer'
                              src={'data:image/jpeg;base64,' + item.image}
                              alt='Avatar'
                            />
                          </div>
                        </div>
                      </li>
                    ))
                  : null}
                {hasVideo && !videoErrorURL ? (
                  <VideoOverlay
                    className='cursor-pointer'
                    style={{
                      listStyleType: 'none',
                      display: 'inline-block',
                      marginRight: '20px',
                    }}
                    onClick={downloadVideo}
                  >
                    <div style={{ width: '90%', paddingBottom: '10px' }}>
                      <div
                        className='img__item'
                        style={{ position: 'relative' }}
                      >
                        <Spin spinning={loading}>
                          <img
                            style={{ width: '120px', height: '120px' }}
                            src={imageOther[0]?.image}
                            alt='Avatar'
                          />
                        </Spin>
                        <PlayCircleOutlined className='play_icon' />
                      </div>
                    </div>
                  </VideoOverlay>
                ) : null}
                {hasVideo && videoErrorURL ? (
                  <VideoOverlay
                    className='cursor-pointer'
                    style={{
                      listStyleType: 'none',
                      display: 'inline-block',
                      marginRight: '20px',
                    }}
                  >
                    <div style={{ width: '90%', paddingBottom: '10px' }}>
                      <div
                        className='img__item'
                        style={{ position: 'relative' }}
                      >
                        <div
                          className='img__item'
                          onClick={(event) => {
                            event.stopPropagation();
                            viewImageAIHandler(videoErrorURL);
                          }}
                        >
                          {videoErrorURL && (
                            <video
                              style={{
                                width: '120px',
                                height: '120px',
                              }}
                              className='video-container video-container-overlay cursor-pointer video-error'
                              loop
                              autoPlay
                            >
                              <source
                                src={videoErrorURL.url}
                                type='video/mp4'
                              />{' '}
                            </video>
                          )}
                        </div>
                      </div>
                    </div>
                  </VideoOverlay>
                ) : null}
              </ul>
            ) : (
              <ul>
                {imageOther
                  ? imageOther.map((item, index) => (
                      <li
                        key={item.id}
                        style={{
                          listStyleType: 'none',
                          display: 'inline-block',
                          marginRight: '20px',
                        }}
                      >
                        <div style={{ width: '90%', paddingBottom: '10px' }}>
                          <div
                            className='img__item'
                            style={{ position: 'relative' }}
                          >
                            {item.uuid !== detailAI.uuid ? (
                              <Popconfirm
                                title={t('noti.sure_to_delete')}
                                onCancel={(event) => {
                                  event.stopPropagation();
                                }}
                                onConfirm={(event) => {
                                  event.stopPropagation();
                                  deleteImageHandler(item.uuid);
                                }}
                              ></Popconfirm>
                            ) : null}

                            {item.type === 'mp4' ? (
                              <div
                                className='img__item'
                                onClick={(event) => {
                                  event.stopPropagation();
                                  viewImageAIHandler(item);
                                }}
                              >
                                {/* <video id={item.id} refs="rtsp://10.0.0.66:8554/proxy6" /> */}
                                <Space size='middle'>
                                  <Spin
                                    className='video-js'
                                    size='large'
                                    id={'spin-slot-' + item.id}
                                    style={{ display: 'none' }}
                                  />
                                </Space>
                                <video
                                  style={{
                                    width: '120px',
                                    height: '120px',
                                  }}
                                  className='video-container video-container-overlay cursor-pointer'
                                  loop
                                  autoPlay
                                >
                                  <source src={item.url} type='video/mp4' />
                                </video>
                              </div>
                            ) : (
                              <img
                                onClick={(event) => {
                                  event.stopPropagation();
                                  viewImageAIHandler(item);
                                }}
                                style={{
                                  width: '120px',
                                  height: '120px',
                                }}
                                className='cursor-pointer'
                                src={item.image}
                                alt='Avatar'
                              />
                            )}
                          </div>
                        </div>
                      </li>
                    ))
                  : null}
                {hasVideo && !videoErrorURL ? (
                  <VideoOverlay
                    className='cursor-pointer'
                    style={{
                      listStyleType: 'none',
                      display: 'inline-block',
                      marginRight: '20px',
                    }}
                    onClick={downloadVideo}
                  >
                    <div style={{ width: '90%', paddingBottom: '10px' }}>
                      <div
                        className='img__item'
                        style={{ position: 'relative' }}
                      >
                        <Spin spinning={loading}>
                          <img
                            style={{ width: '120px', height: '120px' }}
                            src={imageOther[0]?.image}
                            alt='Avatar'
                          />
                        </Spin>
                        <PlayCircleOutlined className='play_icon' />
                      </div>
                    </div>
                  </VideoOverlay>
                ) : null}
                {hasVideo && videoErrorURL ? (
                  <VideoOverlay
                    className='cursor-pointer'
                    style={{
                      listStyleType: 'none',
                      display: 'inline-block',
                      marginRight: '20px',
                    }}
                  >
                    <div style={{ width: '90%', paddingBottom: '10px' }}>
                      <div
                        className='img__item'
                        style={{ position: 'relative' }}
                      >
                        <div
                          className='img__item'
                          onClick={(event) => {
                            event.stopPropagation();
                            viewImageAIHandler(videoErrorURL);
                          }}
                        >
                          {videoErrorURL && (
                            <video
                              style={{
                                width: '120px',
                                height: '120px',
                              }}
                              className='video-container video-container-overlay cursor-pointer video-error'
                              loop
                              autoPlay
                            >
                              <source
                                src={videoErrorURL.url}
                                type='video/mp4'
                              />{' '}
                            </video>
                          )}
                        </div>
                      </div>
                    </div>
                  </VideoOverlay>
                ) : null}
              </ul>
            )}
          </div>
        </Col>
        <Col span={10}>
          <Row className='detail-item'>
            <Col span={10}>
              <div className='title'>
                {t('view.penalty_ticket.vehicle_type')} :{' '}
              </div>
            </Col>
            <Col span={14}>
              {detailAI?.vehicleType}
              {/* <SelectType
                option={typeObjects}
                onChange={(e) => handleSelectType(e)}
                value={objectType}
              /> */}
            </Col>
          </Row>
          <Row className='detail-item'>
            <Col span={10}>
              <div className='title'>{t('view.ai_events.plateNumber')} : </div>
            </Col>
            <Col span={14}>
              {detailAI.plateNumber
                ? detailAI.plateNumber
                : t('view.ai_events.UnKnow')}
            </Col>
          </Row>
          <Row className='detail-item'>
            <Col span={10}>
              <div className='title'>Video :</div>
            </Col>
            <Col span={14}>
              {hasVideo ? (
                <a
                  href={detailAI.videoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Link
                </a>
              ) : null}
            </Col>
          </Row>
          <Row className='detail-item'>
            <Col span={10}>
              <div className='title'>{t('view.common_device.state')} : </div>
            </Col>
            <Col span={14}>
              {detailAI?.status &&
                t(`view.ai_events.processing-status.${detailAI.status}`)}
              {/* <SelectType
                option={processingstatusOptions}
                // className="react-select"
                // classNamePrefix="select-progess-state"
                value={processState}
                onChange={(value) => handleSelectProgessState(value)}
              ></SelectType> */}
            </Col>
          </Row>
        </Col>
      </StyledEventFileDetail>
      <MemoizedTableDetailList
        tracingList={tracingList}
        detailAI={detailAI}
        onClickRow={onClickRow}
        editNoteUpdate={editNoteUpdate}
      ></MemoizedTableDetailList>
      <ActionButton>
        <Col span={6} offset={18}>
          <Row>
            <Col>
              <Button
                disabled={isDisabled()}
                type='primary'
                onClick={handleShowTicketModal}
                className='vms-ant-btn'
              >
                {t('view.common_device.ticket')}
              </Button>
            </Col>
            <Col className='ml-8'>
              <Button
                type='primary'
                className='vms-ant-btn'
                onClick={onNext}
                disabled={isNextDisabled()}
              >
                {t('view.common_device.move')}
              </Button>
            </Col>
          </Row>
        </Col>
      </ActionButton>
    </>
  );
};
export default Viewfiletype4;
