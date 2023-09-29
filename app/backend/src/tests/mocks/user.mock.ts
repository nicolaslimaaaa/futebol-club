export const validUserFromDB = {
  "id": 1,
  "username": "Admin",
  "role": "admin",
  "email": "admin@admin.com",
  "password": "$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW",
}

export const userCreate = {
  "username": "Admin",
  "role": "admin",
  "email": "admin@admin.com",
  "password": "$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW",
}

export const loginUser = {
  "email": "admin@admin.com",
  "password": "secret_admin"
}

export const loginUserWithoutEmail = {
  "email": "",
  "password": "secret_admin"
}

export const loginUserWithoutPassword = {
  "email": "admin@admin.com",
  "password": ""
}

export const messageAllFieldMustBeFilled = {
  "message": "All fields must be filled"
}

export const notFoundEmailLoginUser = {
  "email": "emailNaoCadastrado@email.com",
  "password": "secret_admin"
}

export const invalidEmailLoginUser = {
  "email": "invalid@.com",
  "password": "secret_admin"
}

export const notFoundPasswordLoginUser = {
  "email": "admin@admin.com",
  "password": "senhaNaoCadastrada"
}

export const invalidPasswordLoginUser = {
  "email": "admin@admin.com",
  "password": "12345"
}

export const messageInvalidEmailOrPassword = {
  "message": "Invalid email or password"
}

export const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk2MDE2NjU2fQ.50wNsjBatVKscjUekOQlq9GIyBI0FvOQ7sZzPC0swlA';

export const authorization = `Bearer ${validToken}`

export const invalidAuthorization = 'Bearer tokenInvalido'

export const authorizationWithoutToken = ''

export const messageTokenNotFound = {
  "message": "Token not found"
}

export const messageTokenInvalid = {
  "message": "Token must be a valid token"
}

export const returnTokenValid = {
  "role": "admin"
}