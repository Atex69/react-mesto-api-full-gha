import React from 'react';

function ImagePopup(props) {
    return (
        <div className={`popup popup_type_image" ${props.isOpen ? 'popup_opened-pic' : ''}`} onClick={props.onCloseClick}>
            <figure className="popup__figure">
                <button
                    onClick={props.onClose}
                    type="button"
                    className="popup__close popup__close_type_image"
                ></button>
                <img className="popup__image" src={props.card ? props.card.link : ''} alt={props.card ? props.card.name : ''}/>
                <figcaption className="popup__caption">{props.card ? props.card.name : ''}</figcaption>
            </figure>
        </div>
    )
}

export default ImagePopup;