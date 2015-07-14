import React from 'react';
import {Link} from 'react-router';
import Icon from '../common/Icon';

class Menu extends React.Component {
  
  renderBackTo() {
    const {universeId, universeName, topicId} = this.props;
    if (topicId || this.context.router.isActive('newTopic')) return (
      <div className='menu_item menu_backTo'>
        <Link to='universe' params={{universeId}}>
            <div>Back to</div>
            <div className='menu_backTo_label'>{universeName}</div>
        </Link>
      </div>
    );
  }
  
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
        
        {this.renderBackTo()}
        
        <div className='menu_right'>
        
          <div className='menu_item' onClick={(() => document.querySelector('.menu').classList.toggle('menu-scrolled')).bind()}>
            <Icon name='disk' cssclass='menu_item_icon' />
            <span className='menu_item_label'>{'About Aquest'}</span>
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

// Permet d'acceder a this.context.router
Menu.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default Menu;