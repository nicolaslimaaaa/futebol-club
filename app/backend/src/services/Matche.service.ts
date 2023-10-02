import { ModelStatic } from 'sequelize';
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

  async finish(id: number): Promise<ServiceResponse<{ message: string }>> {
    await this._matcheModel.update({ inProgress: false }, {
      where: { id },
    });

    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }
}
