import NOT_ENV from '../notEnv';

const signin = (user) => {
    return fetch(NOT_ENV.API_DOMAIN + '/auth/signin/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': NOT_ENV.API_DOMAIN
        },
        credentials: 'same-origin',
        body: JSON.stringify(user)
    })
    .then((response) => {
        return response.json()
    }).catch((err) => console.log(err))
}

const signout = () => {
    return fetch(NOT_ENV.API_DOMAIN + '/auth/signout/', {
    method: 'GET',
    }).then(response => {
        return response.json()
    }).catch((err) => console.log(err))
}

export default {
    signin,
    signout
}