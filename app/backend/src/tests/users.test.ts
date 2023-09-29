import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel'

import { Response } from 'superagent';
import { invalidEmailLoginUser, invalidPasswordLoginUser, loginUser, loginUserWithoutEmail, loginUserWithoutPassword, messageAllFieldMustBeFilled, messageInvalidEmailOrPassword, notFoundEmailLoginUser, notFoundPasswordLoginUser, validUserFromDB } from './mocks/user.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  // let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(Example, "findOne")
  //     .resolves({
  //       ...<Seu mock>
  //     } as Example);
  // });

  // after(()=>{
  //   (Example.findOne as sinon.SinonStub).restore();
  // })

  // it('...', async () => {
  //   chaiHttpResponse = await chai
  //      .request(app)
  //      ...

  //   expect(...)
  // });

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
