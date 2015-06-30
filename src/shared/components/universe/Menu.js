import React from 'react';
import {Link} from 'react-router';
import Icon from '../common/Icon';
class Menu extends React.Component {
  render() {
    return (
      <nav>
      
        <ul className="menu_left">
          <li>
            <Link to="user" params={{pseudo:'admin'}}>
                <Icon name="disk" cssclass="menu_icon" />
                <span className="st_hide">{"Admin"}</span>
            </Link>
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