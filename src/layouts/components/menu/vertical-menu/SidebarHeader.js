import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
class SidebarHeader extends Component {
  render() {
    return (
      <div className="navbar-header">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-logo" />
        </NavLink>
      </div>
    );
  }
}

export default SidebarHeader;
