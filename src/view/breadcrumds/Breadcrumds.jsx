import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import { history } from '../../history';
import './Breadcrumds.scss';

export default function Breadcrumds(props) {
  return (
    <div className="Breadcrumds">
      <Breadcrumb style={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumb.Item>
          <HomeOutlined
            style={{
              fontSize: 20,
              paddingBottom: 5
            }}
            className="Breadcrumds-links"
            onClick={(e) => {
              history.push('/');
            }}
          />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={props.url}>
            <span className="Breadcrumds-links">{props.nameParent}</span>
          </Link>
        </Breadcrumb.Item>

        {!isEmpty(props.nameChild) ? (
          <Breadcrumb.Item>{props.nameChild}</Breadcrumb.Item>
        ) : null}
      </Breadcrumb>
    </div>
  );
}
