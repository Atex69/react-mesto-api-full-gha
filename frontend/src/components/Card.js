import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = props.card.owner === currentUser._id;
    const isLiked = props.card.likes.some(i => i === currentUser._id);

    const cardDeleteButtonClassName = (
        `element__delete-card ${isOwn ? 'element__delete-card_visible' : ''}`
    );

    const cardLikeButtonClassName = (
        `element__like${isLiked ? '_active' : ''}`
    );


    function handleClick() {
        props.onCardClick(props.card);
    }

    function handleLikeClick() {
        props.onCardLike(props.card);
    }

    function handleDeleteClick() {
        props.onCardDelete(props.card);
    }

    return(
    <li className="element">
        <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
        <img className="element__image"  src={props.link} alt={props.name} onClick={handleClick} />
        <div className="element__description">
            <h2 className="element__title">{props.name}</h2>
            <div className="element__like-container">
                <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
                <div className="element__like-count">{props.likes}</div>
            </div>
        </div>
    </li>
    )
}

export default Card;