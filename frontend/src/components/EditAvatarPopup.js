import React from "react";
import PopupWithForm from "./PopupWithForm";


function EditAvatarPopup(props) {
    const ref = React.useRef();

    function handleSubmit(evt) {
        evt.preventDefault();

        props.onSubmit({
            avatar_link: ref.current.value
        });
    }

    React.useEffect(() => {
        ref.current.value = '';
    }, [props.isOpen]);

    return(
        <PopupWithForm
            isOpen={props.isOpen}
            onCloseClick={props.onCloseClick}
            onClose={props.onClose}
            form={'placeData'}
            title={'Обновить аватар'}
            name={'avatar'}
            buttonText="Сохранить"
            onSubmit={handleSubmit}
        >
                    <input ref={ref} id="avatar_link" type="url" className="popup__input"
                           name="avatar" placeholder="Введите ссылку на аватар" minLength="2" maxLength="200" required/>
                    <span className="popup__error" id="link-error"></span>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;