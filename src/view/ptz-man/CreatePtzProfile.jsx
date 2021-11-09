// import React, {FormEvent, useEffect} from 'react';
// import {connect, ConnectedProps} from 'react-redux';
// import {Button, Form, Input, Modal, Select, Tree} from 'antd';
// import {FormComponentProps} from 'antd/lib/form';
//
// const {TextArea} = Input;
// const { Option } = Select;
// const { TreeNode } = Tree;
//
// const CreatePtzProfile = (props) => {
//
//     const handleCancel = () => {
//         props.setVisible(false);
//     }
//
//     const formItemLayout = {
//         labelCol: {
//             xs: {span: 24},
//             sm: {span: 6},
//         },
//         wrapperCol: {
//             xs: {span: 24},
//             sm: {span: 18},
//         },
//     };
//
//     return (
//         <>
//             <Modal
//                 maskClosable={false}
//                 centered
//                 title={"Thêm PTZ profile"}
//                 visible={props.visible}
//                 width="650px"
//                 okButtonProps={{hidden: true}}
//                 cancelButtonProps={{hidden: true}}
//                 onCancel={() => handleCancel()}
//                 footer={""}
//                 zIndex={100}>
//                 <Form {...formItemLayout}>
//                     <Form.Item hasFeedback label="Sự kiện">
//                         {WrappedFormUtils.getFieldDecorator('event_name', {
//                             rules: [
//                                 {
//                                     required: true,message:'Trường này bắt buộc',
//                                     message: 'Vui lòng chọn sự kiện',
//                                 },
//                             ],
//                         })(
//                             <Select placeholder="Tất cả sự kiện">
//                                 <Option value="card">Phát hiện card</Option>
//                                 <Option value="face">Phát hiện gương mặt</Option>
//                                 <Option value="license_plate">Phát hiện biển số xe</Option>
//                             </Select>,
//                         )}
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </>
//     );
//
// }
//
// export default CreatePtzProfile;
