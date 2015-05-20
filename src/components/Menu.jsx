import React from 'react';
import Icon from './Icon.jsx';

class Menu extends React.Component {
  render() {
    return (
      <nav>
      
        <ul className="menu_left">
          <li>
            <Icon name="disk" cssclass="menu_icon" />
            <span className="st_hide">{"currentUser"}</span>
          </li>
          <li>
            <Icon name="globe" cssclass="menu_icon" />
            <span className="st_hide">{"Explore"}</span>
          </li>          
        </ul>
        
        <ul className="menu_right">
          <li>
            <Icon name="magnifier" cssclass="menu_icon" />
            <span className="st_hide">{"Feature comming soon"}</span>
          </li>
        </ul>
        
      </nav>
    );
  }
}

export default Menu;