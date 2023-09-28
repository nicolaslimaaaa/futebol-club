import { ModelStatic } from 'sequelize';
import TeamModel from '../database/models/TeamModel';
import ServiceResponse from '../Interfaces/ServiceResponse';

export default class TeamService {
  constructor(
    private _teamModel: ModelStatic<TeamModel> = TeamModel,
  ) {}

  async getAll(): Promise<ServiceResponse<TeamModel[]>> {
    const teams = await this._teamModel.findAll();

    return { status: 'SUCCESSFUL', data: teams };
  }

  async getById(id: number): Promise<ServiceResponse<TeamModel | null>> {
    const team = await this._teamModel.findByPk(id);

    return { status: 'SUCCESSFUL', data: team };
  }
}
