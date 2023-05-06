import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import * as auth from "../utils/auth";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import resolve from "../images/resolve.svg";
import reject from "../images/reject.svg";

function App() {
    const navigate = useNavigate();
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emailName, setEmailName] = useState(null);
    const [popupImage, setPopupImage] = useState("");
    const [popupTitle, setPopupTitle] = useState("");
    const [infoTooltip, setInfoTooltip] = useState(false);





    function onRegister(email, password) {
        auth.registerUser(email, password).then(() => {
            setPopupImage(resolve);
            setPopupTitle("Вы успешно зарегистрировались!");
            navigate("/sign-in");
        }).catch(() => {
            setPopupImage(reject);
            setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
        }).finally(handleInfoTooltip);
    }

    function handleInfoTooltip() {
        setInfoTooltip(true);
    }

    function onLogin(email, password) {
        auth.loginUser(email, password).then((res) => {
            localStorage.setItem("jwt", res.token);
            setIsLoggedIn(true);
            setEmailName(email);
            navigate("/");
        }).catch(() => {
            closeAllPopups();
            setPopupImage(reject);
            setPopupTitle("Неправильная почта или пароль.");
            handleInfoTooltip();
        });
    }

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            auth.getToken(jwt)
                .then((res) => {
                    if (res) {
                        setIsLoggedIn(true);
                        setEmailName(res.data.email);
                    }
                })
                .catch((err) => {
                    console.log(`Не удалось получить токен: ${err}`);
                })
        }
    }, []);


    useEffect(() => {
        if (isLoggedIn === true) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (isLoggedIn === true) {
            Promise.all([api.getUserData(), api.getInitialCards()])
                .then(([user, cards]) => {
                    setCurrentUser(user.user);
                    setCards(cards.reverse());
                })
                .catch(() => {
                    closeAllPopups();
                    setPopupImage(reject);
                    setPopupTitle("Что-то пошло не так! Ошибка авторизации.");
                    handleInfoTooltip();
                });
        }
    }, [isLoggedIn]);

    function handleUpdateUser(data) {
        api.setUserInfo(data).then((newUser) => {
            setCurrentUser(newUser);
            closeAllPopups();
        }).catch(() => {
            setPopupImage(reject);
            setPopupTitle("Что-то пошло не так! Не удалось обновить профиль.");
            handleInfoTooltip();
        });
    }


    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i === currentUser._id);

        if (!isLiked) {
            api.addLike(card._id).then((newCard) => {
                setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
            }).catch(() => {
                closeAllPopups();
                setPopupImage(reject);
                setPopupTitle("Что-то пошло не так! Не удалось поставить лайк.");
                handleInfoTooltip();
            });
        } else {
            api.deleteLike(card._id).then((newCard) => {
                setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
            }).catch(() => {
                closeAllPopups();
                setPopupImage(reject);
                setPopupTitle("Что-то пошло не так! Не удалось снять лайк.");
                handleInfoTooltip();
            });
        }
    }

    function handleAddPlaceSubmit(data) {
        api.addNewCard(data).then((newCard) => {
            setCards([newCard, ...cards]);
            closeAllPopups();
        }).catch(() => {
            closeAllPopups();
            setPopupImage(reject);
            setPopupTitle("Что-то пошло не так! Не удалось создать карточку.");
            handleInfoTooltip();
        });
    }

    function handleCardDelete(card) {
        api.deleteCard(card).then(() => {
            setCards((items) => items.filter((c) => c !== card && c));
            closeAllPopups();
        }).catch(() => {
            closeAllPopups();
            setPopupImage(reject);
            setPopupTitle("Что-то пошло не так! Не удалось удалить карточку.");
            handleInfoTooltip();
        });
    }

    function handleAvatarUpdate(data) {
        api.sendAvatar(data).then((newAvatar) => {
            setCurrentUser(newAvatar);
            closeAllPopups();
        }).catch(() => {
            closeAllPopups();
            setPopupImage(reject);
            setPopupTitle("Что-то пошло не так! Не удалось обновить аватар.");
            handleInfoTooltip();
        });
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
        setIsImagePopupOpen(true);
    }

    function handleCardDelete(card) {
        setSelectedCard(card);
        setIsDeletePopupOpen(true);
    }

    function handlePopupCloseClick(evt) {
        if (evt.target.classList.contains('popup')) {
            closeAllPopups();
        }
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsImagePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setInfoTooltip(false);
    }

    useEffect(() => {
        if (isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard || infoTooltip) {
            function handleEsc(evt) {
                if (evt.key === 'Escape') {
                    closeAllPopups();
                }
            }

            document.addEventListener('keydown', handleEsc);

            return () => {
                document.removeEventListener('keydown', handleEsc);
            }
        }
    }, [isEditAvatarPopupOpen, isEditProfilePopupOpen, isAddPlacePopupOpen, selectedCard, infoTooltip]);
    function onSignOut() {
        setIsLoggedIn(false);
        setEmailName(null);
        navigate("/sign-in");
        localStorage.removeItem("jwt");
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <div className="page__content">
                    <Routes>
                        <Route path="/sign-in" element={
                            <>
                                <Header title="Регистрация" route="/sign-up"/>
                                <Login onLogin={onLogin} />
                            </>
                        }/>

                        <Route path="/sign-up" element={
                            <>
                                <Header title="Войти" route="/sign-in"/>
                                <Register onRegister={onRegister} />
                            </>
                        }/>

                        <Route exact path="/" element={
                            <>
                                <Header title="Выйти" mail={emailName} onClick={onSignOut} route="" />
                                <ProtectedRoute
                                    component={Main}
                                    isLogged={isLoggedIn}
                                    onEditAvatar={handleEditAvatarClick}
                                    onEditProfile={handleEditProfileClick}
                                    onAddPlace={handleAddPlaceClick}
                                    onCardClick={handleCardClick}
                                    cards={cards}
                                    onCardLike={handleCardLike}
                                    onCardDelete={handleCardDelete}
                                />
                                <Footer />
                            </>
                        }/>

                        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/sign-in"}/>} />
                    </Routes>


                    <EditProfilePopup
                        isOpen={isEditProfilePopupOpen}
                        onCloseClick={handlePopupCloseClick}
                        onClose={closeAllPopups}
                        onUpdateUser ={handleUpdateUser}
                    />

                    <AddPlacePopup
                        isOpen={isAddPlacePopupOpen}
                        onCloseClick={handlePopupCloseClick}
                        onClose={closeAllPopups}
                        onSubmit={handleAddPlaceSubmit}
                    />

                    <DeleteCardPopup
                        isOpen={isDeletePopupOpen}
                        onCloseClick={handlePopupCloseClick}
                        onClose={closeAllPopups}
                        onSubmit={handleCardDelete}
                        card={selectedCard}
                    />

                    <EditAvatarPopup
                        isOpen={isEditAvatarPopupOpen}
                        onCloseClick={handlePopupCloseClick}
                        onClose={closeAllPopups}
                        onSubmit={handleAvatarUpdate}
                    />

                    <ImagePopup
                        card={selectedCard}
                        isOpen={isImagePopupOpen}
                        onClose={closeAllPopups}
                        onCloseClick={handlePopupCloseClick}
                    />
                    <InfoTooltip
                        image={popupImage}
                        title={popupTitle}
                        isOpen={infoTooltip}
                        onCloseClick={handlePopupCloseClick}
                        onClose={closeAllPopups}
                    />
                </div>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;