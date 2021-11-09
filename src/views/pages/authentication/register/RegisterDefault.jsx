import React from 'react';
import { Check } from 'react-feather';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Alert,
  CardBody
} from 'reactstrap';
import UserApi from '../../../../actions/api/user/UserApi';
import Checkbox from '../../../../components/@vuexy/checkbox/CheckboxesVuexy';
import { history } from '../../../../history';

const STATUS_CODE = {
  SUCCESS: 201
};

class RegisterDefault extends React.Component {
  state = {
    domain: '',
    email: '',
    password: '',
    name: '',
    confirmPass: '',
    erros: false,
    messageErrors: ''
  };

  handleRegister = async (e) => {
    e.preventDefault();

    const { email, password, name, domain, confirmPass } = this.state;

    if (password !== confirmPass) {
      this.setState({
        messageErrors: 'Kiểm tra lại mật khẩu.'
      });
    }

    const payload = {
      email: email,
      password: password,
      name: name,
      domain: domain
    };

    const result = await UserApi.register(payload);

    if (result.code !== STATUS_CODE.SUCCESS) {
      this.setState({
        erros: true,
        messageErrors: result.message
      });
    } else {
      history.push('/pages/login');
    }
  };

  render() {
    const { email, password, name, domain, confirmPass, erros, messageErrors } =
      this.state;

    return (
      <React.Fragment>
        <CardBody className="pt-1">
          <Form action="/" onSubmit={this.handleRegister}>
            <FormGroup className="form-label-group form-group">
              <Input
                style={{
                  backgroundColor: '#262c49',
                  color: '#ebeefd',
                  border: 'none'
                }}
                type="text"
                placeholder="Domain"
                required
                value={domain}
                onChange={(e) => this.setState({ domain: e.target.value })}
              />
              <Label style={{ color: '#c2c6dc !important' }}>Domain</Label>
            </FormGroup>
            <FormGroup className="form-label-group form-group">
              <Input
                style={{
                  backgroundColor: '#262c49',
                  color: '#ebeefd',
                  border: 'none'
                }}
                type="text"
                placeholder="Tên"
                required
                value={name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
              <Label>Tên</Label>
            </FormGroup>
            <FormGroup className="form-label-group form-group">
              <Input
                style={{
                  backgroundColor: '#262c49',
                  color: '#ebeefd',
                  border: 'none'
                }}
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
              <Label>Email</Label>
            </FormGroup>
            <FormGroup className="form-label-group form-group">
              <Input
                style={{
                  backgroundColor: '#262c49',
                  color: '#ebeefd',
                  border: 'none'
                }}
                type="password"
                placeholder="Mật khẩu"
                required
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
              />
              <Label>Mật khẩu</Label>
            </FormGroup>

            <FormGroup className="form-label-group form-group">
              <Input
                style={{
                  backgroundColor: '#262c49',
                  color: '#ebeefd',
                  border: 'none'
                }}
                type="password"
                placeholder="Xác nhận mật khẩu"
                required
                value={confirmPass}
                onChange={(e) => this.setState({ confirmPass: e.target.value })}
              />
              <Label>Xác nhận mật khẩu</Label>
            </FormGroup>
            <FormGroup>
              <Checkbox
                color="primary"
                icon={<Check className="vx-icon" size={16} />}
                // label="Tôi chấp nhận các điều kiện và điều khoản."

                label={
                  <p
                    style={{
                      color: '#c2c6dc',
                      alignItems: 'center',
                      margin: 0
                    }}
                  >
                    Tôi chấp nhận các điều kiện và điều khoản.
                  </p>
                }
                defaultChecked={true}
              />
            </FormGroup>

            {erros && <Alert color="warning">{messageErrors}</Alert>}

            <div className="d-flex justify-content-between">
              <Button.Ripple
                color="primary"
                outline
                onClick={() => {
                  history.push('/pages/login');
                }}
              >
                Đăng nhập
              </Button.Ripple>
              <Button.Ripple color="primary" type="submit">
                Đăng kí
              </Button.Ripple>
            </div>
          </Form>
        </CardBody>
      </React.Fragment>
    );
  }
}

export default RegisterDefault;
