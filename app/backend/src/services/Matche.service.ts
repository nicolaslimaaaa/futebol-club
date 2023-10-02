import { ModelStatic } from 'sequelize';
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
}
