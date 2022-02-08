import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Modal, Tree } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reactLocalStorage } from 'reactjs-localstorage';
import CameraApi from '../../../../actions/api/camera/CameraApi';
import UserApi from '../../../../actions/api/user/UserApi';
import Notification from '../../../../components/vms/notification/Notification';
import './ModalAddPermissionOthers.scss';

const { TreeNode } = Tree;

const ModalAddPermissionOthers = (props) => {
  const { handleShowModalAdd, selectedAdd, checkedPermission } = props;
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(selectedAdd);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [menuListCode, setMenuListCode] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [treeNodeCamList, setTreeNodeCamList] = useState([]);
  const language = reactLocalStorage.get('language')
  const [isEmpt, setIsEmpty] = useState(false);
  const [option, setOption] = useState({
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    defaultExpandAll: true
  });

  const { expandedKeys, autoExpandParent, defaultExpandAll } = option;

  useEffect(() => {
    const data = {
      lang: language,
    }
    UserApi.getAllPermissionGroup(data).then((result) => {
      const dataRemoveMonitoring = result.payload.filter(
        (r) => r.code !== 'monitoring'
      );

      const newData = dataRemoveMonitoring.map((p) => {
        return {
          code: p.code,
          name: p.name,
          children: p.permissions.map((p) => {
            return {
              code: p.code,
              name: p.name
            };
          })
        };
      });

      setTreeData(newData);
      setTreeNodeCamList(newData);
    });

    setMenuListCode(props.checkedPermission);
  }, []);

  useEffect(() => {}, [menuListCode]);

  const handleSubmit = async () => {
    if (isEmpty(selectedRowKeys)) {
      return;
    }

    const dataRemove = props.checkedPermission.filter(
      (c) => !selectedRowKeys.includes(c)
    );
    const dataAdd = selectedRowKeys.filter(
      (c) => !props.checkedPermission.includes(c)
    );

    const payloadAdd = {
      subject: `user_g@${props?.groupCode}`,
      object: `user_g@${props?.groupCode}`,
      action: dataAdd[0],
      actions: dataAdd
    };

    const payloadRemove = dataRemove.map((dr) => {
      return {
        subject: `user_g@${props?.groupCode}`,
        object: `user_g@${props?.groupCode}`,
        action: dr
      };
    });

    const dataRM = {
      policies: payloadRemove
    };
    let isAdd, isRemove;

    if (!isEmpty(dataAdd)) {
      isAdd = await CameraApi.setPermisionCamGroup(payloadAdd);
    }

    if (!isEmpty(dataRemove)) {
      isRemove = await CameraApi.removePermisionCamGroup(dataRM);
    }

    if (isAdd || isRemove) {
      const notifyMess = {
        type: 'success',
        title: '',
        description: `${t('noti.successfully_edit_permission')}`
      };
      Notification(notifyMess);
    }

    setIsModalVisible(false);
    handleShowModalAdd();
  };

  const handleCancel = async () => {
    setIsModalVisible(false);
    handleShowModalAdd();
  };

  const renderTitle = (id, name) => {
    return (
      <div className="full-width d-flex justify-content-between">
        <div className="titleGroup" title={name}>
          {name}
        </div>
      </div>
    );
  };

  const onExpand = (expandedKeys) => {
    setOption({
      ...option,
      expandedKeys,
      autoExpandParent: true
    });
  };

  const dataList = [];
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { name, code } = node;
      dataList.push({ key: code, title: name, titleUnsign: unsign(name) });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  generateList(treeData);
  const getParentKey = (key, treeData) => {
    let parentKey;
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i];
      if (node.children) {
        if (node.children.some((item) => item.code === key)) {
          parentKey = node.code;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      } else {
        parentKey = key;
      }
    }
    return parentKey;
  };

  const getTreeNodeExpand = (key, treeNodeCam) => {
    let treeNodeExpand;
    if (treeNodeCam.code === key) {
      treeNodeExpand = treeNodeCam.code;
    } else if (treeNodeCam.children) {
      if (treeNodeCam.children.some((item) => item.code === key)) {
        treeNodeExpand = treeNodeCam.code;
      } else {
        for (let i = 0; i < treeNodeCam.children.length; i++) {
          if (getTreeNodeExpand(key, treeNodeCam.children[i])) {
            treeNodeExpand = getTreeNodeExpand(key, treeNodeCam.children[i]);
            break;
          }
        }
      }
    }
    return treeNodeExpand;
  };

  const handleFilterTreeData = (treeData, expandedKeys) => {
    let treeDataFilter = [];
    if (expandedKeys.length > 0) {
      treeDataFilter = treeData.filter((tree) =>
        expandedKeys.find((key) => getTreeNodeExpand(key, tree))
      );
    }
    return treeDataFilter;
  };

  const handleSearch = async (value) => {
    setSearch(value);
    if (isEmpty(value)) {
      setOption({
        ...option,
        expandedKeys: [],
        searchValue: value
      });
      setTreeNodeCamList(treeData);
      return;
    }
    const valueSearch = unsign(value);
    const expandedKeys = dataList
      .map((item) => {
        if (item.titleUnsign.indexOf(valueSearch) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    let newTreeData = JSON.parse(JSON.stringify(treeData));
    const treeDataFilter = handleFilterTreeData(newTreeData, expandedKeys);

    if (isEmpty(treeDataFilter)) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }

    setTreeNodeCamList(treeDataFilter);
    setOption({
      ...option,
      expandedKeys,
      searchValue: value
    });
  };

  const loop = (data) =>
    data.map((item) => {
      const index = item.name.toLowerCase().indexOf(option.searchValue.toLowerCase());
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + option.searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span
              style={{
                color: "#1380ff",
              }}
            >
              {option.searchValue}
            </span>
            {afterStr}
          </span>
        ) : (
          <span>{item.name}</span>
        );

      if (item.children) {
        return (
          <TreeNode
            key={item.code}
            title={
              <div className="full-width d-flex justify-content-between">
                <div className="titleGroup" title={title}>
                  {title}
                </div>
              </div>
            }
          >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.code}
          title={
            <div className="full-width d-flex justify-content-between">
              <div className="titleGroup" title={title}>
                {title}
              </div>
            </div>
          }
        />
      );
    });

  function unsign(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  const onCheck = (checkedKeysValue) => {
    setMenuListCode(checkedKeysValue);
    const dataRemove = [
      'monitoring',
      'nvr',
      'configuration',
      'map',
      'storage',
      'user'
    ];

    const data = checkedKeysValue.filter((c) => !dataRemove.includes(c));

    setSelectedRowKeys(data);
  };

  const handleBlur = (event) => {
    const value = event.target.value.trim();
    setSearch(value);
  };

  return (
    <>
      <Modal
        title={t('view.user.detail_list.add_permission', { add: t('add') })}
        className="modal__add-permission-other--in-group-user"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        style={{ top: 30, height: 790, borderRadius: 10 }}
        width={1000}
        okText={t('view.map.button_save')}
        cancelText={t('view.map.button_cancel')}
        maskStyle={{ background: 'rgba(51, 51, 51, 0.9)' }}
      >
        <AutoComplete
          style={{ marginBottom: 20 }}
          className=" full-width height-40 read search__camera-group"
          value={search}
          onSearch={handleSearch}
          onBlur={handleBlur}
          maxLength={255}
          placeholder={
            <div className="placehoder height-40 justify-content-between d-flex align-items-center">
              <span style={{ opacity: '0.5' }}>
                {' '}
                &nbsp; {t('view.map.search')}{' '}
              </span>{' '}
              <SearchOutlined style={{ fontSize: 20, color: '#E3F0FF' }} />
            </div>
          }
        />
        <Tree
          style={{ backgroundColor: '#191919' }}
          checkable
          className="treeData"
          onCheck={onCheck}
          checkedKeys={menuListCode}
          onExpand={onExpand}
          autoExpandParent={autoExpandParent}
          expandedKeys={expandedKeys}
        >
          {loop(treeNodeCamList)}
        </Tree>

        {isEmpt && (
          <div className="text-center" style={{ color: 'white' }}>
            {t('view.user.detail_list.no_valid_results_found')}
          </div>
        )}
      </Modal>
    </>
  );
};

export default ModalAddPermissionOthers;
