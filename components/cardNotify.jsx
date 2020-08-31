import React from 'react';
import moment from 'moment'
import Show from '../components/show';

const CardNotify = ({ username, title, date, description, icon, image, read = false }) => {
    return (
        <div className={`list-group-item ${read ? '' : 'unread-important'}`}>
            {/* <!-- message figure --> */}
            <div className="list-group-item-figure">
                <span className="rating rating-sm mr-3">
                    
                </span>
                <Show condicion={image}>
                    <a href="#" className="user-avatar">
                        <img src={image} alt=""/>
                    </a> 
                </Show>

                <Show condicion={!image}>
                    <div className="notify-icon">
                        <i className={icon}></i>
                    </div>
                </Show>
            </div>
            {/* <!-- message body --> */}
            <div className="list-group-item-body pl-md-2">
                {/* <!-- grid row --> */}
                <div className="row">
                    {/* <!-- grid column --> */}
                    <div className="col-12 col-lg-3 d-none d-lg-block">
                        <h4 className="list-group-item-title text-truncate">
                            <a href="page-conversations.html">{username}</a>
                        </h4>
                        <p className="list-group-item-text"> {moment(date, "YYYY/MM/DD HH:mm:ss").fromNow()} </p>
                    </div>
                    {/* <!-- grid column --> */}
                    <div className="col-12 col-lg-9">
                        <h4 className="list-group-item-title text-truncate">
                            <a href="page-conversations.html">{title}</a>
                        </h4>
                        <p className="list-group-item-text text-truncate">{description}</p>
                    </div>
                    {/* <!-- grid column --> */}
                    <div className="col-12 d-lg-none">
                         <p className="list-group-item-text">{moment(date, "YYYY/MM/DD HH:mm:ss").fromNow()}</p>
                    </div>
                </div>
            </div>
            {/* <!-- message actions --> */}
            <div className="list-group-item-figure">
                {/* <!-- .dropdown --> */}
                <div className="dropdown">
                    <button className="btn btn-sm btn-icon btn-secondary" data-toggle="dropdown" aria-expanded="false">
                        <i className="fa fa-ellipsis-h"></i>
                    </button> 
                    <div className="dropdown-menu dropdown-menu-right">
                        <div className="dropdown-arrow mr-n1"></div>
                        <a href="#" className="dropdown-item">Mark as read</a> 
                        <a href="#" className="dropdown-item">Mark as unread</a> 
                        <a href="#" className="dropdown-item">Toggle star</a> 
                        <a href="#" className="dropdown-item">Trash</a>
                    </div>
                </div>
            </div>                  
        </div>
    )
}

export default CardNotify;