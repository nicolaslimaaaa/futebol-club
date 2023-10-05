import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import MatcheModel from '../database/models/MatcheModel'
import TeamModel from '../database/models/TeamModel';
import { matchesFinishedFromDb } from './mocks/matche.mock';
import { allTeamsFromDb } from './mocks/team.mocks';
import { infosHomeTeam } from './mocks/leaderboard.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /leaderboard/home ', () => {
  beforeEach(function () {
    sinon.restore()
  });

  it('Testa se ao fazer uma requisição para a rota /leaderboard/home serão retornoados as informações do time da casa', async function () {    
    const mockFindAllTeamsReturn = TeamModel.bulkBuild(allTeamsFromDb)

    sinon.stub(TeamModel, "findAll").resolves(mockFindAllTeamsReturn)
    sinon.stub(MatcheModel, "findAll").resolves(matchesFinishedFromDb as unknown as MatcheModel[]);

    const { status, body } = await chai.request(app).get('/leaderboard/home');

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(infosHomeTeam);
  });
});
