import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatcheModel from '../database/models/MatcheModel'

import { Response } from 'superagent';
import {
  authorization,
  matcheCreated,
  matchesFromDb,
  messageForEqualsTeams,
  messageForTeamNotExists,
  newMatche,
  newMatcheWithEqualTeams,
  newMatcheWithTeamNotExists
} from './mocks/matche.mock';
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

describe('POST /matches', () => {
  beforeEach(function () {
    sinon.restore()
  });

  it('Testa se é possível inserir uma partida no banco de dados com sucesso', async function () {    
    const mockCreateReturn = MatcheModel.build(matcheCreated);
    
    sinon.stub(MatcheModel, "create").resolves(mockCreateReturn);

    const { status, body } = await chai.request(app).post('/matches').send(newMatche).set('Authorization', authorization);

    expect(status).to.be.equal(201);
    expect(body).to.be.deep.equal(matcheCreated);
  });

  it('Testa se não é possível inserir uma partida no banco de dados com times iguais', async function () {    

    const requestBody = newMatcheWithEqualTeams;

    const { status, body } = await chai.request(app).post('/matches').send(requestBody).set('Authorization', authorization);

    expect(status).to.be.equal(422);
    expect(body).to.be.deep.equal(messageForEqualsTeams);
  });

  it('Testa se não é possível inserir uma partida no banco de dados com um time que não existe na tabela de times', async function () {    
    sinon.stub(MatcheModel, "findByPk").resolves(null);

    const requestBody = newMatcheWithTeamNotExists;

    const { status, body } = await chai.request(app).post('/matches').send(requestBody).set('Authorization', authorization);

    expect(status).to.be.equal(404);
    expect(body).to.be.deep.equal(messageForTeamNotExists);
  });
});
