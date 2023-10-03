import { ModelStatic } from 'sequelize';
import INewMatche from '../Interfaces/matches/NewMatche';
import NewResult from '../Interfaces/matches/MatchResult';
import TeamModel from '../database/models/TeamModel';
import MatcheModel from '../database/models/MatcheModel';
import ServiceResponse from '../Interfaces/ServiceResponse';

export default class MatcheService {
  constructor(
    private _matcheModel: ModelStatic<MatcheModel> = MatcheModel,
  ) {}

  async getAll(query: string): Promise<ServiceResponse<MatcheModel[]>> {
    if (query === 'true' || query === 'false') {
      const matches = await this._matcheModel.findAll({
        include: [
          { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
        ],
        where: { inProgress: Boolean(query !== 'false') },
      });
      console.log('Service', query);

      return { status: 'SUCCESSFUL', data: matches };
    }

    const matches = await this._matcheModel.findAll({
      include: [
        { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });

    return { status: 'SUCCESSFUL', data: matches };
  }

  async endGame(id: number): Promise<ServiceResponse<{ message: string }>> {
    await this._matcheModel.update({ inProgress: false }, {
      where: { id },
    });

    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  async changesMatchResult(newResult: NewResult): Promise<ServiceResponse<{ message: string }>> {
    const { id, homeTeamGoals, awayTeamGoals } = newResult;

    await this._matcheModel.update({ homeTeamGoals, awayTeamGoals }, {
      where: { id },
    });

    return { status: 'SUCCESSFUL', data: { message: 'Match result successfully changed!' } };
  }

  async newMatche(dataNewMatche: INewMatche): Promise<ServiceResponse<MatcheModel>> {
    const { homeTeamId, awayTeamId } = dataNewMatche;

    const homeTeamExist = await TeamModel.findByPk(homeTeamId);
    const awayTeamExist = await TeamModel.findByPk(awayTeamId);

    if (!homeTeamExist || !awayTeamExist) {
      return {
        status: 'NOT_FOUND',
        data: { message: 'There is no team with such id!' },
      };
    }

    const matche = await this._matcheModel.create({ ...dataNewMatche, inProgress: true });

    return { status: 'CREATED', data: matche };
  }
}
