import React from 'react';
import './msg-disconnected.styles.scss';

const MsgDisconnected = ({disconnected}) => (
    <div className="msg-disconnected">
            <p>{disconnected}</p>
    </div>
)

export default MsgDisconnected;