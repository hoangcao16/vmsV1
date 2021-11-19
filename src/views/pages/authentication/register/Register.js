import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col, Row
} from 'reactstrap';
import registerImg from '../../../../assets/img/pages/register.jpg';
import '../../../../assets/scss/pages/authentication.scss';
import RegisterDefault from './RegisterDefault';

class Register extends React.Component {
  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-1 py-0"
              >
                <img className="mr-1" src={registerImg} alt="registerImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card
                  className="rounded-0 mb-0 p-2"
                  style={{ backgroundColor: '#10163a' }}
                >
                  <CardHeader className="pb-1 pt-50">
                    <CardTitle>
                      <h4 style={{ color: '#ebeefd' }} className="mb-0">
                        Tạo tài khoản
                      </h4>
                    </CardTitle>
                  </CardHeader>
                  <p
                    className="px-2 auth-title mb-0"
                    style={{ color: '#ebeefd' }}
                  >
                    Vui lòng điền vào form dưới đây để tạo 1 tài khoản mới.
                  </p>

                  <CardBody className="pt-1 pb-50">
                    <RegisterDefault />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default Register;
