import NOT_ENV from "../notEnv";

const create = (user) => {
  return fetch(NOT_ENV.API_DOMAIN + '/api/users/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then((response) => {
      return response.json()
    }).catch((err) => console.log(err))
}

const list = () => {
  return fetch(NOT_ENV.API_DOMAIN + '/api/users/', {
    method: 'GET',
  }).then(response => {
    return response.json()
  }).catch((err) => console.log(err))
}

const read = (params, credentials) => {
  return fetch(NOT_ENV.API_DOMAIN + '/api/users/' + params.userId, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    }
  }).then((response) => {
    return response.json()
  }).catch((err) => console.log(err))
}

const update = (params, credentials, user) => {
  return fetch(NOT_ENV.API_DOMAIN + '/api/users/' + params.userId, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    },
    body: JSON.stringify(user)
  }).then((response) => {
    return response.json()
  }).catch((err) => console.log(err))
}

const remove = (params, credentials) => {
  return fetch(NOT_ENV.API_DOMAIN + '/api/users/' + params.userId, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    }
  }).then((response) => {
    return response.json()
  }).catch((err) => console.log(err))
}

const stripeUpdate = (params, credentials, auth_code) => {
  return fetch(NOT_ENV.API_DOMAIN + '/api/stripe_auth/' + params.userId, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials.t
    },
    body: JSON.stringify({stripe: auth_code})
  }).then((response)=> {
    return response.json()
  }).catch((err) => {
    console.log(err)
  })
}

const donations = (params, credentials) => {
  return fetch(NOT_ENV.API_DOMAIN + '/api/users/' + params.userId + '/donations', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + credentials
    }
  }).then((response) => {
    return response.json()
  }).catch((err) => console.log(err))
}

let userActions;
export default userActions = {
  create,
  list,
  read,
  update,
  remove,
  stripeUpdate,
  donations
}
