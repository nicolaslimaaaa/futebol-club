import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';
import { teamsFromDB } from './mocks/team.mocks'

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /teams', () => {
  beforeEach(function () {
    sinon.restore()
  });

  it('Testa se ao fazer uma requisição do tipo GET para a rota /teams é retornado um array de times', async function () {
    const mockFindAllReturn = TeamModel.bulkBuild(teamsFromDB);
    sinon.stub(TeamModel, "findAll").resolves(mockFindAllReturn);

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(teamsFromDB);
  });
});
