import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import React from 'react';

class BreadCrumbs extends React.Component {
  render() {
    return (
      <div className="content-header row mb-2">
        <div className="content-header-left col-md-9 col-12">
          <div className="row breadcrumbs-top">
            <div className="col-12">


              
              {this.props.breadCrumbTitle ? (
                <h2 className="content-header-title float-left mb-0">
                  {this.props.breadCrumbTitle}
                </h2>
              ) : (
                ''
              )}



              <div className="breadcrumb-wrapper d-sm-block d-none col-12">
                <Breadcrumb
                  tag="ol"
                  style={{
                    paddingTop: '43px'
                  }}
                >
                  <Breadcrumb.Item style={{ padding: '0 10px' }}>
                    <HomeOutlined
                      style={{
                        position: 'absolute',
                        top: '43px',
                        left: '0',
                        fontSize: '20px'
                      }}
                    />
                  </Breadcrumb.Item>
                  <Breadcrumb.Item style={{ padding: '0 10px' }}>
                    <span>{this.props.breadCrumbParent}</span>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item style={{ padding: '0 10px' }}>
                    <span>{this.props.breadCrumbActive}</span>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
export default BreadCrumbs;
