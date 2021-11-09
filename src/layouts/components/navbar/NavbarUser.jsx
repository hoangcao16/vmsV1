// import { isEmpty } from 'lodash';
// import React, { useEffect, useState } from 'react';
// import * as Icon from 'react-feather';
// import { reactLocalStorage } from 'reactjs-localstorage';
// import {
//   DropdownItem,
//   DropdownMenu,
//   DropdownToggle,
//   UncontrolledDropdown
// } from 'reactstrap';
// import userImg from '../../../assets/img/portrait/small/avatar-s-11.jpg';
// import { history } from '../../../history';

// const handleNavigation = (e, path) => {
//   e.preventDefault();
//   history.push(path);
// };

// const UserDropdown = (props) => {
//   return (
//     <DropdownMenu right>
//       <DropdownItem
//         tag="a"
//         href="#"
//         onClick={(e) => handleNavigation(e, '/pages/profile')}
//       >
//         <Icon.User size={14} className="mr-50" />
//         <span className="align-middle">Hồ sơ cá nhân</span>
//       </DropdownItem>
//       <DropdownItem divider />
//       <DropdownItem
//         tag="a"
//         href="/pages/login"
//         onClick={(e) => {
//           e.preventDefault();
//           if (!isEmpty(props.user)) {
//             history.push('/pages/login');
//             localStorage.setItem('user.info', null);
//           }
//         }}
//       >
//         <Icon.Power size={14} className="mr-50" />
//         <span className="align-middle">Đăng xuất</span>
//       </DropdownItem>
//     </DropdownMenu>
//   );
// };

// const NavbarUser = () => {
//   const [user, setUser] = useState('');
//   const [langDropdown, setLangDropdown] = useState(false);

//   useEffect(() => {
//     let dataUserLocal = reactLocalStorage.getObject('user', null);
    
//     console.log('dataUserLocal: ' + JSON.stringify(dataUserLocal));
//     if (dataUserLocal === undefined || dataUserLocal === null) {
//       history.push('/pages/login');
//       reactLocalStorage.remove('user');
//       return;
//     }

//     setUser(dataUserLocal);
//     console.log('');
//   }, []);

//   const handleLangDropdown = () => {
//     setLangDropdown(!langDropdown);
//   };

//   return (
//     <>
//       <ul className="nav navbar-nav navbar-nav-user float-right">
//         <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
//           <DropdownToggle tag="a" className="nav-link dropdown-user-link">
//             <div className="user-nav d-sm-flex d-none">
//               <span className="user-name text-bold-600">{user.fullName}</span>
//               <span className="user-status">Trực tuyến</span>
//             </div>
//             <span data-tour="user">
//               <img
//                 src={userImg}
//                 className="round"
//                 height="40"
//                 width="40"
//                 alt="avatar"
//               />
//             </span>
//           </DropdownToggle>
//           <UserDropdown user={user} />
//         </UncontrolledDropdown>
//       </ul>
//     </>
//   );
// };

// export default NavbarUser;
