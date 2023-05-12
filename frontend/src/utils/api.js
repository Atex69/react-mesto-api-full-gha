
class Api {
    constructor(options) {
        this._url = options.url;
        this._headers = options.headers;
    }

    _handleResponse(res) {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`${res.status} ${res.statusText}`);
        }
    }
    _getHeaders() {
        const jwt = localStorage.getItem('jwt');
        return {
            'Authorization': `Bearer ${jwt}`,
            ...this._headers,
        };
    }

    getUserData()  {
        return fetch(`${this._url}/users/me`, {
            headers: this._getHeaders(),
        }).then((res) => {
            return this._handleResponse(res);
        });
    }

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
            headers: this._getHeaders(),
        }).then((res) => {
            return this._handleResponse(res);
        });
    }
    setUserInfo(data){
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: this._getHeaders(),
            body: JSON.stringify({
                name: data.name,
                about: data.about,
            }),
        }).then((res) => {
            return this._handleResponse(res);
        });
    }
    addNewCard(data) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: this._getHeaders(),
            body: JSON.stringify({
                name: data.name,
                link: data.link,
            }),
        }).then((res) => {
            return this._handleResponse(res);
        });
    }

    deleteCard(data) {
        return fetch(`${this._url}/cards/${data._id}`, {
            method: 'DELETE',
            headers: this._getHeaders(),
        }).then((res) => {
            return this._handleResponse(res);
        });
    }
    addLike(cardId) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'PUT',
            headers: this._getHeaders(),
        }).then((res) => {
            return this._handleResponse(res);
        });
    }

    deleteLike(cardId) {
        return fetch(`${this._url}/cards/likes/${cardId}`, {
            method: 'DELETE',
            headers: this._getHeaders(),
        }).then((res) => {
            return this._handleResponse(res);
        });
    }

    sendAvatar(data) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._getHeaders(),
            body: JSON.stringify({
                avatar: data.avatar_link,
            }),
        }).then((res) => {
            return this._handleResponse(res);
        });
    }
}


const api = new Api({
    url: "https://api.memorysnap.nomoredomains.monster",
    headers: {
        "Content-Type": "application/json",
    },
})

export default api;