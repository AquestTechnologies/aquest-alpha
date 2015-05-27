import React from 'react';
import Router from 'react-router';
let Link = Router.Link;
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
            <Link to="explore">
              <Icon name="globe" cssclass="menu_icon" />
              <span className="st_hide">{"Explore"}</span>
            </Link>
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