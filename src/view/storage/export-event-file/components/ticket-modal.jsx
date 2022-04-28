import { Button } from 'antd';
import { StyledTicketModal, StyledInput, StyledConfirmSend } from './style';
import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import { getText } from './toVND';
import './index.css';
import SendTicketModal from './send-ticket-modal';
import SendEmailApi from '../../../../actions/api/send-email';
import Notification from '../../../../components/vms/notification/Notification';

const PrintSection = ({
  componentRef,
  data,
  fine,
  handleSetFine,
  totext,
  urlSnapshot,
}) => {
  const { t } = useTranslation();
  return (
    <div
      ref={componentRef}
      style={{ padding: '16px', boxSizing: 'border-box' }}
      id='print-me'
    >
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div
          style={{
            width: '100%',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
          className='title-print'
        >
          {t('view.penalty_ticket.ticket')}
        </div>
        <div style={{ fontSize: '14px' }} className='ticket-number'>
          {t('view.penalty_ticket.num')}: {data?.penaltyTicketId}
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td
              style={{
                width: '30%',
                paddingLeft: '2rem',
                paddingBottom: '16px',
                fontWeight: 'bold',
              }}
            >
              {t('view.penalty_ticket.vehicle_type')}
            </td>
            <td style={{ paddingBottom: '16px', textAlign: 'left' }}>
              {data?.vehicleType && data?.vehicleType}
              {/* t("view.ai_events.type_object." + data?.typeObject)} */}
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: '30%',
                paddingLeft: '2rem',
                paddingBottom: '16px',
                fontWeight: 'bold',
              }}
            >
              {t('view.ai_events.plateNumber')}
            </td>
            <td style={{ paddingBottom: '16px', textAlign: 'left' }}>
              {data?.plateNumber ? data?.plateNumber : 'Không xác định'}
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: '30%',
                paddingLeft: '2rem',
                paddingBottom: '16px',
                fontWeight: 'bold',
              }}
            >
              {t('view.live.camera_record')}
            </td>
            <td style={{ paddingBottom: '16px', textAlign: 'left' }}>
              {data?.cameraName}
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: '30%',
                paddingLeft: '2rem',
                paddingBottom: '16px',
                fontWeight: 'bold',
              }}
            >
              {t('view.penalty_ticket.violation_datetime')}
            </td>
            <td style={{ paddingBottom: '16px', textAlign: 'left' }}>
              {data?.createdTime &&
                moment(data?.createdTime).format('HH:mm DD/MM/YYYY')}
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: '30%',
                paddingLeft: '2rem',
                paddingBottom: '16px',
                fontWeight: 'bold',
              }}
            >
              {t('view.penalty_ticket.violation_type')}
            </td>
            <td style={{ paddingBottom: '16px', textAlign: 'left' }}>
              {data?.eventType && t('view.ai_events.' + data?.eventType)}
            </td>
          </tr>
          <tr>
            <td
              style={{
                width: '30%',
                paddingLeft: '2rem',
                paddingBottom: '16px',
                fontWeight: 'bold',
              }}
            >
              {t('view.penalty_ticket.total_fine')}
            </td>
            <td style={{ paddingBottom: '16px', textAlign: 'left' }}>
              <span style={{ display: 'inline-flex' }}>
                <StyledInput
                  placeholder='............................'
                  value={fine}
                  type='number'
                  min={0}
                  onChange={(e) => handleSetFine(e)}
                />
                {fine === '' ? (
                  ''
                ) : (
                  <>
                    <span className='fine'>{fine}</span>
                    <span>&nbsp;đồng&nbsp;</span>
                  </>
                )}
              </span>
              ({t('view.penalty_ticket.to_text')}: {totext}{' '}
              {totext === '' ? '' : 'đồng'})
            </td>
          </tr>
          <tr>
            <td
              style={{
                verticalAlign: 'top',
                paddingBottom: '16px',
                fontWeight: 'bold',
                paddingLeft: '2rem',
              }}
            >
              {t('view.penalty_ticket.violation_proof')}
            </td>
            <td>
              {urlSnapshot !== '' ? (
                <div style={{ paddingBottom: '16px', textAlign: 'left' }}>
                  <div>{t('view.penalty_ticket.violation_img')}:</div>
                  <div>
                    <img
                      style={{ maxWidth: '200px', height: '120px' }}
                      className='cursor-pointer'
                      src={urlSnapshot}
                      alt='violation-img'
                    />
                  </div>
                </div>
              ) : (
                ''
              )}
              {data?.videoUrl ? (
                <div className='violation_video' style={{ textAlign: 'left' }}>
                  Video:{' '}
                  <a
                    className='video-link'
                    href={data.videoUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {t('view.penalty_ticket.click-to-view-video')}
                  </a>
                </div>
              ) : (
                ''
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <div className='pagebreak'></div>
    </div>
  );
};
const TicketModal = ({
  visible,
  handleOk,
  handleCancel,
  data,
  handleSelectProgessState,
  imageViolate,
}) => {
  const { t } = useTranslation();
  const componentRef = useRef();
  const [fine, setFine] = useState('');
  const [totext, setTotext] = useState('');
  // Send Ticket Modal
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const handleOpenSendModal = () => {
    setSendModalVisible(true);
  };
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
  const handleSendTicket = (e) => {
    StyledConfirmSend.confirm({
      title: t('view.penalty_ticket.confirm_send'),
      okText: t('view.common_device.agree'),
      cancelText: t('view.common_device.cancel'),
      centered: true,
      onCancel() {
        console.log('Cancel');
      },
      onOk: async () => {
        const dataSend = {
          cameraName: data?.cameraName,
          cameraUuid: data?.cameraUuid,
          createdTime: moment(data?.createdTime).format('HH:mm DD/MM/YYYY'),
          eventName: data?.eventName,
          money: `${fine} ${totext === '' ? '' : `(${totext} đồng )`}`,
          overViewUrl: data?.overViewUrl,
          penaltyTicketId: data?.penaltyTicketId,
          plateNumber: data?.plateNumber,
          uuid: data?.uuid,
          vehicleType: data?.vehicleType,
          videoUrl: data?.videoUrl,
          emails: e.email.replace(/\s/g, ''),
        };
        try {
          let isSend = await SendEmailApi.sendEmail(dataSend);
          if (isSend) {
            handleSelectProgessState(processingstatusOptions[1]);
            const notifyMess = {
              type: 'success',
              title: `${t('noti.success')}`,
              description: `${t('noti.sent_mail_successful')}`,
            };
            Notification(notifyMess);
            setSendModalVisible(false);
            setResetForm(!resetForm);
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  };
  const handleCancelSend = () => {
    setSendModalVisible(false);
    setResetForm(!resetForm);
  };
  //send ticket
  //print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleSetFine = (e) => {
    if (parseFloat(e.target.value) < 0) {
      setFine(0);
    } else if (e?.target?.value?.length > 10) {
      const value = e.target.value.slice(0, 10);
      setFine(value);
      if (value !== '' && !isNaN(parseFloat(value))) {
        const text = getText(parseFloat(value));
        setTotext(text?.charAt(0)?.toUpperCase() + text?.slice(1));
      } else {
        setTotext('');
      }
    } else {
      const value = e.target.value;
      setFine(value);
      if (value !== '' && !isNaN(parseFloat(value))) {
        const text = getText(parseFloat(value));
        setTotext(text?.charAt(0)?.toUpperCase() + text?.slice(1));
      } else {
        setTotext('');
      }
    }
  };
  useEffect(() => {
    setFine('');
    setTotext('');
  }, [visible]);
  return (
    <>
      <StyledTicketModal
        visible={visible}
        onOk={handleOk}
        width={1000}
        onCancel={handleCancel}
        footer={[
          <Button key='print' type='primary' onClick={handlePrint}>
            {t('view.penalty_ticket.print_ticket')}
          </Button>,
          <Button
            key='send'
            type='primary'
            // loading={loading}
            onClick={handleOpenSendModal}
          >
            {t('view.penalty_ticket.send_ticket')}
          </Button>,
          <Button
            // loading={loading}
            key='back'
            onClick={handleCancel}
          >
            {t('view.camera.close')}
          </Button>,
        ]}
      >
        <PrintSection
          componentRef={componentRef}
          data={data}
          fine={fine}
          handleSetFine={handleSetFine}
          totext={totext}
          urlSnapshot={imageViolate}
        />
        <SendTicketModal
          sendModalVisible={sendModalVisible}
          handleSendTicket={handleSendTicket}
          handleCancelSend={handleCancelSend}
          resetForm={resetForm}
        />
      </StyledTicketModal>
    </>
  );
};
export default TicketModal;
