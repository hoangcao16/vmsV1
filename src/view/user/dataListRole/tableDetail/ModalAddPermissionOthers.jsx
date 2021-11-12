import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Modal, Tree } from 'antd';
import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CameraApi from '../../../../actions/api/camera/CameraApi';
import UserApi from '../../../../actions/api/user/UserApi';
import Notification from '../../../../components/vms/notification/Notification';
import './ModalAddPermissionOthers.scss';

const { TreeNode } = Tree;

const ModalAddPermissionOthers = (props) => {
  const { handleShowModalAdd, selectedAdd } = props;
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [isEmpt, setIsEmpty] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(selectedAdd);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [menuListCode, setMenuListCode] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [treeNodeCamList, setTreeNodeCamList] = useState([]);
  const [option, setOption] = useState({
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    defaultExpandAll: true
  });

  const { expandedKeys, autoExpandParent, defaultExpandAll } = option;

  useEffect(() => {
    UserApi.getAllPermissionGroup().then((result) => {
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
      subject: `role@${props?.rolesCode}`,
      object: `role@${props?.rolesCode}`,
      action: dataAdd[0],
      actions: dataAdd
    };

    const payloadRemove = dataRemove.map((dr) => {
      return {
        subject: `role@${props?.rolesCode}`,
        object: `role@${props?.rolesCode}`,
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
        description: 'Sửa quyền thành công'
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
      if (item.children) {
        return (
          <TreeNode key={item.code} title={renderTitle(item.code, item.name)}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode key={item.code} title={renderTitle(item.code, item.name)} />
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
        className="modal__add-permission-other--in-detail-role"
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
          value={search}
          onSearch={handleSearch}
          onBlur={handleBlur}
          maxLength={255}
          style={{ marginBottom: 20 }}
          className=" full-width height-40 read search__camera-group"
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
