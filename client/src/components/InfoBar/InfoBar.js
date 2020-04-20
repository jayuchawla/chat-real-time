import React from 'react';
import './InfoBar.css';
import closeIcon from '../../icons/close.png';
import onlineIcon from '../../icons/online.png';

const InfoBar = ({room}) => (
    <div className="infoBar">
        <div className="leftInnerContainer">
            <img className = "onlineIcon" src={onlineIcon} alt="online icon" />
            <h3>Room Name: {room}</h3>
        </div>
        <div className="rightInnerContainer">
            <a href="/"><img className="closeIcon" src={closeIcon} alt = "close icon"/></a>
        </div>
    </div>
    );

export default InfoBar;