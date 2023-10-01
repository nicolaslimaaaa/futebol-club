import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchesModel from '../database/models/MatchesModel'
import { teamsFromDB } from './mocks/team.mocks'

import { Response } from 'superagent';
import { matchesFromDb } from './mocks/matches.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /matches', () => {
  beforeEach(function () {
    sinon.restore()
  });

  it('Testa se ao fazer uma requisição do tipo GET para a rota /matches é retornado um array de partidas', async function () {
    const mockFindAllReturn = MatchesModel.bulkBuild(matchesFromDb);
    sinon.stub(MatchesModel, "findAll").resolves(mockFindAllReturn);

    const { status, body } = await chai.request(app).get('/matches');

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(matchesFromDb);
  });
});
