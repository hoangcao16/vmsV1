import {
  StyledSendTicketModal,
  SendTicketModalHeader,
  StyledOutSideSelect,
  StyledEmailInput,
  ErrorMessage,
} from './style'
import { Row, Col, Radio, Button, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
const OutSideSystemOptions = [
  {
    label: 'Hệ thống 1',
    value: 1,
  },
  {
    label: 'Hệ thống 2',
    value: 2,
  },
  {
    label: 'Hệ thống 3',
    value: 3,
  },
]
const SendTicketModal = ({
  sendModalVisible,
  handleSendTicket,
  handleCancelSend,
}) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState(1)
  const hanldeTabs = (e) => {
    setActiveTab(e.target.value)
  }
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  return (
    <>
      <StyledSendTicketModal
        visible={sendModalVisible}
        // onOk={handleSendTicket}
        width={520}
        title={<Header />}
        centered={true}
        onCancel={handleCancelSend}
        footer={null}
      >
        <form onSubmit={handleSubmit(handleSendTicket)}>
          <Row>
            <Col span={6}>
              <span>Nơi nhận</span>
            </Col>
            <Col span={17} offset={1}>
              <Row>
                <Radio.Group
                  name='radiogroup'
                  defaultValue={1}
                  onChange={hanldeTabs}
                >
                  <Radio value={1}>Ngoài hệ thống</Radio>
                  <Radio value={2}>Lãnh đạo</Radio>
                </Radio.Group>
              </Row>
              <Row>
                <Col span={24} className='email-content'>
                  {activeTab === 1 ? (
                    <StyledOutSideSelect
                      options={OutSideSystemOptions}
                      className='react-select'
                      classNamePrefix='select-outside-system'
                    />
                  ) : (
                    <Controller
                      name='email'
                      rules={{
                        pattern: {
                          value:
                            /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+(\s*[,]\s*(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/,
                          message: 'Giữa các email cách nhau một dấu ","',
                        },
                        required: 'Invalid email',
                      }}
                      control={control}
                      render={({ field }) => (
                        <>
                          <StyledEmailInput
                            autoSize={true}
                            {...field}
                            data-type={errors?.email ? 'error' : 'normal'}
                          />
                          <ErrorMessage>{errors.email?.message}</ErrorMessage>
                        </>
                      )}
                    />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='ant-modal-footer'>
            <Col offset={12} span={12}>
              <Button type='primary' htmlType='submit'>
                {t('view.penalty_ticket.send_ticket')}
              </Button>
              <Button onClick={handleCancelSend}>
                {t('view.camera.close')}
              </Button>
            </Col>
          </Row>
        </form>
      </StyledSendTicketModal>
    </>
  )
}
export default SendTicketModal
const Header = () => {
  return <SendTicketModalHeader>Gửi phiếu phạt</SendTicketModalHeader>
}
