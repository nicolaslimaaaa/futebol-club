import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/UserModel'

import { Response } from 'superagent';
import { loginUser, userCreate } from './mocks/user.mock';

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

  it('Testa se ao fazer uma requisição do tipo POST para a rota /login é possível fazer login com sucesso', async function () {
    const mockCreateReturn = UserModel.build(userCreate);

    sinon.stub(UserModel, "create").resolves(mockCreateReturn);

    const { status, body } = await chai.request(app).post('/login').send(loginUser);

    expect(status).to.be.equal(200);
    expect(body).to.have.property('token');
  });
});
