import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel'

import { Response } from 'superagent';
import {
  authorization,
  invalidAuthorization,
  invalidEmailLoginUser,
  invalidPasswordLoginUser,
  loginUser,
  loginUserWithoutEmail,
  loginUserWithoutPassword,
  messageAllFieldMustBeFilled,
  messageInvalidEmailOrPassword,
  messageTokenInvalid,
  messageTokenNotFound,
  notFoundEmailLoginUser,
  notFoundPasswordLoginUser,
  returnTokenValid,
  validUserFromDB
} from './mocks/user.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {
  beforeEach(function () {
    sinon.restore()
  });

  it('Testa se é possível fazer login com sucesso', async function () {
    const mockFindOndeReturn = UserModel.build(validUserFromDB);

    sinon.stub(UserModel, "findOne").resolves(mockFindOndeReturn);

    const { status, body } = await chai.request(app).post('/login').send(loginUser);

    expect(status).to.be.equal(200);
    expect(body).to.have.property('token');
  });

  it('Testa se não é possível fazer login sem email', async function () {
    const mockFindOndeReturn = UserModel.build(validUserFromDB);

    sinon.stub(UserModel, "findOne").resolves(mockFindOndeReturn);

    const { status, body } = await chai.request(app).post('/login').send(loginUserWithoutEmail);

    expect(status).to.be.equal(400);
    expect(body).to.be.deep.equal(messageAllFieldMustBeFilled);
  });

  it('Testa se não é possível fazer login sem password', async function () {
    const mockFindOndeReturn = UserModel.build(validUserFromDB);

    sinon.stub(UserModel, "findOne").resolves(mockFindOndeReturn);

    const { status, body } = await chai.request(app).post('/login').send(loginUserWithoutPassword);

    expect(status).to.be.equal(400);
    expect(body).to.be.deep.equal(messageAllFieldMustBeFilled);
  });

  it('Testa se não é possível fazer login com um email não cadastrado', async function () {
    sinon.stub(UserModel, "findOne").resolves();

    const { status, body } = await chai.request(app).post('/login').send(notFoundEmailLoginUser);

    expect(status).to.be.equal(401);
    expect(body).to.be.deep.equal(messageInvalidEmailOrPassword);
  });

  it('Testa se não é possível fazer login com um email inválido', async function () {
    const mockFindOndeReturn = UserModel.build(validUserFromDB);

    sinon.stub(UserModel, "findOne").resolves(mockFindOndeReturn);

    const { status, body } = await chai.request(app).post('/login').send(invalidEmailLoginUser);

    expect(status).to.be.equal(401);
    expect(body).to.be.deep.equal(messageInvalidEmailOrPassword);
  });

  it('Testa se não é possível fazer login com uma senha não cadastrada', async function () {
    const mockFindOndeReturn = UserModel.build(validUserFromDB);

    sinon.stub(UserModel, "findOne").resolves(mockFindOndeReturn);

    const { status, body } = await chai.request(app).post('/login').send(notFoundPasswordLoginUser);

    expect(status).to.be.equal(401);
    expect(body).to.be.deep.equal(messageInvalidEmailOrPassword);
  });

  it('Testa se não é possível fazer login com uma senha inválida', async function () {
    const mockFindOndeReturn = UserModel.build(validUserFromDB);

    sinon.stub(UserModel, "findOne").resolves(mockFindOndeReturn);

    const { status, body } = await chai.request(app).post('/login').send(invalidPasswordLoginUser);

    expect(status).to.be.equal(401);
    expect(body).to.be.deep.equal(messageInvalidEmailOrPassword);
  });
});

describe('GET /login/role', () => {
  beforeEach(function () {
    sinon.restore()
  });

  it('Testa que não é possível retornar um objeto com o tipo de usuário, sem um token', async function () {
    const mockFindOndeReturn = UserModel.build(validUserFromDB);

    sinon.stub(UserModel, "findOne").resolves(mockFindOndeReturn);

    const { status, body } = await chai.request(app).get('/login/role').send({ header: authorization });

    expect(status).to.be.equal(401);
    expect(body).to.be.deep.equal(messageTokenNotFound);
  });

  it('Testa que não é possível retornar um objeto com o tipo de usuário, com um token inválido', async function () {
    const mockFindOndeReturn = UserModel.build(validUserFromDB);

    sinon.stub(UserModel, "findOne").resolves(mockFindOndeReturn);

    const { status, body } = await chai.request(app).get('/login/role').send({ header: invalidAuthorization });

    expect(status).to.be.equal(401);
    expect(body).to.be.deep.equal(messageTokenInvalid);
  });

  it('Testa que é possível retornar um objeto com o tipo de usuário', async function () {
    const mockFindOndeReturn = UserModel.build(validUserFromDB);

    sinon.stub(UserModel, "findOne").resolves(mockFindOndeReturn);

    const { status, body } = await chai.request(app).get('/login/role').send({ header: authorization });

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(returnTokenValid);
  });
});
