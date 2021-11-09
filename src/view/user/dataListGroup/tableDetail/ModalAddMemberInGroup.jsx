import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Modal, Table } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserApi from '../../../../actions/api/user/UserApi';
import Notification from '../../../../components/vms/notification/Notification';
import { ShowTotal } from '../../../../styled/showTotal';
import { renderText } from '../../dataListUser/components/TableListUser';
// import { ShowTotal } from '../../../../styled/showTotal';
import './ModalAddMemberInGroup.scss';

const ModalAddMemberInGroup = (props) => {
  const { handleShowModalAdd, selectedAdd } = props;

  const [isModalVisible, setIsModalVisible] = useState(selectedAdd);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState('');

  const [user, setUser] = useState([]);

  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let data = {
      searchName: search,
      unit: 'all',
      page: 0,
      size: 0
    };
    UserApi.getAllUser(data).then((result) => {
      let selectedId = props?.checkedGroup;
      const data = result?.payload.filter((r) => !selectedId.includes(r.uuid));
      setUser(data);

      setTotal(result?.metadata?.total);
    });
  }, []);


  const onSelectChange = (selectedRowKeys) => {
    // setSelectedRowKeys([...props?.checkedGroup, ...selectedRowKeys]);
    setSelectedRowKeys([
      ...new Set(props?.checkedGroup.concat(selectedRowKeys))
    ]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const hasSelected = selectedRowKeys.length - props.checkedGroup.length > 0;

  const handleSearch = async (value) => {
    setSearch(value);
    let data = {
      searchName: value,
      unit: 'all',
      page: 0,
      size: 0
    };
    UserApi.getAllUser(data).then((result) => {
      let selectedId = props?.checkedGroup;
      const data = result?.payload.filter((r) => !selectedId.includes(r.uuid));
      setUser(data);
      setTotal(result?.metadata?.total);
    });
  };

  const handleSubmit = async () => {
    const payload = {
      user_uuids: selectedRowKeys,
      group_uuid: props?.groupUuid
    };

    const isAdd = await UserApi.addMemberInGroups(payload);

    if (isAdd) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: 'Bạn đã thêm thành công thành viên'
      };
      Notification(notifyMess);
    }

    setIsModalVisible(false);
    handleShowModalAdd();
  };
  const handleBlur = (event) => {
    const value = event.target.value.trim();
    setSearch(value);
  };

  const renderHeader = () => {
    return (
      <>
        <div className="d-flex justify-content-between">
          <AutoComplete
            className=" full-width height-40"
            value={search}
            onSearch={handleSearch}
            onBlur={handleBlur}
            maxLength={255}
            placeholder={
              <div className="placehoder height-40 justify-content-between d-flex align-items-center">
                <span style={{ opacity: '0.5' }}>
                  {' '}
                  &nbsp;{' '}
                  {t('view.user.detail_list.please_enter_search_keyword', {
                    plsEnter: t('please_enter')
                  })}{' '}
                </span>{' '}
                <SearchOutlined style={{ fontSize: 22 }} />
              </div>
            }
          />
        </div>
        <div style={{ marginRight: 20, marginBottom: 20, marginTop: 20, color: '#ffffff', height: '20px' }}>
          {hasSelected
            ? `${t('view.storage.choose')} ${selectedRowKeys.length - props.checkedGroup.length
            } ${t('view.storage.record')}`
            : ''}
        </div>
      </>
    );
  };

  const onShowSizeChange = (current, pageSize) => {
    setPage(current);
    setSize(pageSize);
  };

  const columns = [
    {
      title: `${t('view.user.detail_list.member_name')}`,
      dataIndex: 'name',
      className: 'name',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      className: 'headerUserColums',
      render: renderText,
      ellipsis: true,
    },
    {
      title: `${t('view.user.detail_list.dob')}`,
      dataIndex: 'date_of_birth',
      className: 'headerUserColums',
      render: renderText
    },
    {
      title: `${t('view.user.detail_list.phone_number')}`,
      dataIndex: 'phone',
      className: 'headerUserColums',
      render: renderText
    }
  ];


  return (
    <>
      <Modal
        title={t('view.user.detail_list.add_member', { add: t('add') })}
        className="modal__add-member--in-group-user"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleShowModalAdd}
        style={{ top: 30, height: 790, borderRadius: 10 }}
        width={1000}
        okText={t('view.map.button_save')}
        cancelText={t('view.map.button_cancel')}
        maskStyle={{ background: 'rgba(51, 51, 51, 0.9)' }}

      >
        <Table
          className="tableAddMember"
          rowKey="uuid"
          columns={columns}
          dataSource={user}
          title={renderHeader}
          pagination={{
            showSizeChanger: true,
            onShowSizeChange: (current, size) => {
              onShowSizeChange(current, size);
            },
            hideOnSinglePage: false,
            current: page,
            total: total,
            pageSize: size,
            onChange: (value) => {
              setPage(value);
            },
            showTotal: (total, range) => {
              return (
                <ShowTotal className='show--total'>
                  {t('view.user.detail_list.viewing')} {range[0]} {t('view.user.detail_list.to')} {range[1]} {t('view.user.detail_list.out_of')} {total} {t('view.user.detail_list.indexes')}
                </ShowTotal>
              );
            }
          }}
          // scroll={{ y: 300 }}
          rowSelection={rowSelection}
          rowClassName={(includes) =>
            props?.checkedGroup.includes(includes?.uuid) ? 'disabled-row' : ''
          }
          locale={{
            emptyText: `${t('view.user.detail_list.no_valid_results_found')}`
          }}
        />
      </Modal>
    </>
  );
};

export default ModalAddMemberInGroup;
