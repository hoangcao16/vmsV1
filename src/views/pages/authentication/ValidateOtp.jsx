import React, { useEffect } from "react";
import {
  Row
} from 'reactstrap';
import '../../../assets/scss/pages/authentication.scss';
import UserApi from "../../../actions/api/user/UserApi";
import {reactLocalStorage} from "reactjs-localstorage";
import {history} from "../../../history";

const ValidateOtp = () => {

  useEffect(() => {
    getToken().then();
  }, []);

  const getToken = async () => {
    const authResult = new URLSearchParams(window.location.search);
    const otp = authResult.get("otp");
    if (otp !== null && otp !== "") {
      const data = await UserApi.getTokenFromOtp({ otp });
      if (data.accessToken !== undefined) {
        let user = {
          token: data?.accessToken,
          refreshToken: data?.refreshToken,
          userUuid: data?.userUuid,
          avatar_file_name: data?.avatar_file_name
        };
        await reactLocalStorage.setObject('user', user);
        await UserApi.getPermissionForUserLogin().then((result) => {
          reactLocalStorage.setObject('permissionUser', result);
        });
        history.push('/');
      }else{
        history.push("/pages/login");
      }
    }else{
      history.push("/pages/login");
    }
  }

  return (
    <Row className='m-0 justify-content-center pd-top-bottom'>
    </Row>
  );
};

export default ValidateOtp;
