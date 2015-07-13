import React from 'react';
import {Link} from 'react-router';
import Icon from '../common/Icon';

class Menu extends React.Component {
  
  render() {
    return (
      <div className='menu'>
      
        <div className='menu_left'>
        
          <div className='menu_item'>
            <Link to='user' params={{pseudo:'admin'}}>
                <Icon name='disk' cssclass='menu_item_icon' />
                <span className='menu_item_label'>{'Admin'}</span>
            </Link>
          </div>
          
          <div className='menu_item'>
            <Link to='explore'>
              <Icon name='globe' cssclass='menu_item_icon' />
              <span className='menu_item_label'>{'Explore'}</span>
            </Link>
          </div>  
          
        </div>
        
        <div className='menu_right'>
        
          <div className='menu_item'>
            <Link to='home'>
                <Icon name='disk' cssclass='menu_item_icon' />
                <span className='menu_item_label'>{'About Aquest'}</span>
            </Link>
          </div>
          
          <div className='menu_item'>
            <Icon name='magnifier' cssclass='menu_item_icon' />
            <span className='menu_item_label'>{'Feature comming soon'}</span>
          </div>
          
        </div>
        
      </div>
    );
  }
}

export default Menu;