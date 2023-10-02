import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatcheModel from '../database/models/MatcheModel'
import { teamsFromDB } from './mocks/team.mocks'

import { Response } from 'superagent';
import { matchesFromDb } from './mocks/matche.mock';
import TeamModel from '../database/models/TeamModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /matches', () => {
  beforeEach(function () {
    sinon.restore()
  });

  it('Testa se ao fazer uma requisição do tipo GET para a rota /matches é retornado um array de partidas', async function () {    
    const mockModel = sinon.stub(MatcheModel, "findAll").resolves(matchesFromDb as unknown as MatcheModel[]);

    const { status, body } = await chai.request(app).get('/matches');

    expect(mockModel.calledWithExactly({
      include: [
        { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ]
    })).to.be.true
    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(matchesFromDb);
  });
});
