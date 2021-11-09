import { Card, Form, Select } from "antd";
import { isEmpty } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import HardDriveListApi from "../../../actions/api/hard-drive-list/HardDriveListApi";
import { validateEmail } from "../../../actions/function/MyUltil/Validate";
// import Notification from '../../../../components/vms/notification/Notification';
import Notification from '../../../components/vms/notification/Notification';
import './../../commonStyle/commonCard.scss';
import './../../commonStyle/commonForm.scss';
import './../../commonStyle/commonInput.scss';
import './../../commonStyle/commonSelect.scss';
import './emailConfig.scss';
import { loadAllEmail } from './redux/actions';
import { bodyStyleCard, headStyleCard } from './variables';
import { useTranslation } from 'react-i18next';

const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};

const EmailConfig = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    props.handleFetchData();
  }, []);

  const render = (name, id) => {
    return <div className="d-flex">{name}</div>;
  };

  const onChange = async (value) => {
    //validate

    let data = [];

    if (isEmpty(value)) {
      data = value;
    } else {
      const checkEmail = value.filter((v) => {
        let isCheck = validateEmail(v);
        return isCheck;
      });

      if (checkEmail.length < value.length) {
        const notifyMess = {
          type: "error",
          title: "",
          description: "Đã xóa các email ko hợp lệ",
        };
        Notification(notifyMess);
        form.setFieldsValue({ uuid: checkEmail });
        return;
      }

      // const newLabel = checkEmail.map((c) => {
      //   if (!props?.allEmailsNoConvert.includes(c)) {
      //     return `${c}(new user)`;
      //   }
      //   return c;
      // });

      // form.setFieldsValue({ uuid: newLabel });
      // return;

      data = checkEmail;
    }

    const update = await HardDriveListApi.updateEmail(data);

    if (update) {
      const notifyMess = {
        type: "success",
        title: "",
        description: "Cập nhật thành công",
      };
      Notification(notifyMess);
    } else {
      let emailUuidArr = [];

      if (!isEmpty(props?.emails)) {
        emailUuidArr = props?.emails.map((r) => r.uuid);
        form.setFieldsValue({ uuid: emailUuidArr });
      } else {
        form.setFieldsValue({ uuid: [] });
      }
    }
    // props.handleFetchData();
  };

  let emailUuidArr = [];

  if (!isEmpty(props?.emails)) {
    emailUuidArr = props?.emails.map((r) => r.uuid);
    form.setFieldsValue({ uuid: emailUuidArr });
  }

  if (!isEmpty(props?.allEmails) && isEmpty(props?.emails)) {
    form.setFieldsValue({ uuid: [] });
  }

  return (
    <div className="roleEmail">
      <Card
        className="cardEmail"
        title={t('view.storage.email_sending_to_users_setting')}
        headStyle={headStyleCard}
        bodyStyle={bodyStyleCard}
      >
        {!isEmpty(props?.allEmails) ? (
          <Form
            className="bg-grey"
            form={form}
            {...formItemLayout}
            initialValues={emailUuidArr}
          >
            <Form.Item name={["uuid"]}>
              <Select
                mode="tags"
                // mode="multiple"
                style={{ width: "100%" }}
                options={props?.allEmails.map((g) => ({
                  value: g.uuid,
                  label: render(g.value, g.uuid),
                }))}
                onChange={(e) => onChange(e)}
                bordered={false}
                showSearch={true}
              />
            </Form.Item>
          </Form>
        ) : null}
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.email.isLoading,
  allEmails: state.email.allEmails.map((am) => ({ value: am, uuid: am })),
  error: state.email.error,
  emails: state.email.emails.map((m) => ({ value: m, uuid: m })),
  allEmailsNoConvert: state.email.allEmails,

  // var result = arr.map(person => ({ value: person.id, text: person.name }));
});

const mapDispatchToProps = (dispatch) => {
  return {
    handleFetchData: (params) => {
      dispatch(loadAllEmail(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailConfig);
