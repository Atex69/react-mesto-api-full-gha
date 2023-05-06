import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main(props) {
    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="profile">
                <div className="profile__card">
                    <img
                        alt={currentUser.name}
                        className="profile__avatar"
                        src={currentUser.avatar}
                    />
                    <button type="button" className="profile__avatar-edit" onClick={props.onEditAvatar}></button>
                    <div className="profile__info">
                        <div className="profile__info-name">
                            <h1 className="profile__info-title">{currentUser.name}</h1>
                            <button
                                type="button"
                                className="profile__info-edit-button"
                                onClick={props.onEditProfile}
                            ></button>
                        </div>
                        <p className="profile__info-subtitle">{currentUser.about}</p>
                    </div>
                </div>
                <button type="button" className="profile__add-button" onClick={props.onAddPlace}></button>
            </section>
            <section className="elements">
                <ul className="elements__container">
                    {props.cards.map((card) => (
                        <Card
                            key={card._id}
                            card={card}
                            link={card.link}
                            name={card.name}
                            likes={card.likes.length}
                            onCardClick={props.onCardClick}
                            onCardLike={props.onCardLike}
                            onCardDelete={props.onCardDelete}
                        />
                    ))}
                </ul>
            </section>
        </main>
    )
}

export default Main;