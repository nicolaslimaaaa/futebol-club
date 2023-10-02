import { ModelStatic } from 'sequelize';
import TeamModel from '../database/models/TeamModel';
import MatcheModel from '../database/models/MatcheModel';
import ServiceResponse from '../Interfaces/ServiceResponse';

export default class MatcheService {
  constructor(
    private _matcheModel: ModelStatic<MatcheModel> = MatcheModel,
  ) {}

  async getAll(): Promise<ServiceResponse<MatcheModel[]>> {
    const matches = await this._matcheModel.findAll({
      include: [
        { model: TeamModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });

    return { status: 'SUCCESSFUL', data: matches };
  }
}
