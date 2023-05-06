import PopupWithForm from './PopupWithForm';
import React from "react";

function DeleteCardPopup(props) {
    function handleSubmit(evt) {
        evt.preventDefault();

        props.onSubmit(props.card);
    }

    return (
        <PopupWithForm
            isOpen={props.isOpen}
            onCloseClick={props.onCloseClick}
            onClose={props.onClose}
            name={'delete'}
            title={'Подтвердите удаление'}
            buttonText={'Подтверждаю'}
            onSubmit={handleSubmit}
        />
    );
}

export default DeleteCardPopup;