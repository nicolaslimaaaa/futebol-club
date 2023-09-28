import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { teamsFromController, teamsFromDB } from './mocks/team.mocks'

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /teams', () => {
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

  it('Testa se ao fazer uma requisição do tipo GET para a rota /teams é retornado um array de times', async function () {
    const mockFindAllReturn = SequelizeTeam.bulkBuild(teamsFromDB)
    sinon.stub(SequelizeTeam, "findAll").resolves(mockFindAllReturn)

    await chai.request(app).get('/teams').send(teamsFromController)

    expect(teamsFromController.status).to.be.equal(200);
    expect(teamsFromController.data).to.be.deep.equal(teamsFromDB);
  });
});
