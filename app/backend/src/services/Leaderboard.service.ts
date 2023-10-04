import ILeaderboard from '../Interfaces/leaderboard/Leaderboard';
import ServiceResponse from '../Interfaces/ServiceResponse';
import MatcheService from './Matche.service';
import TeamService from './Team.service';
import TeamModel from '../database/models/TeamModel';
import MatcheModel from '../database/models/MatcheModel';
import ITeam from '../Interfaces/teams/Team';

export default class Leaderboard {
  private _allTeams: TeamModel[] = [];
  private _allMatches: MatcheModel[] = [];
  private _matchesHomeTeam: MatcheModel[] = [];

  constructor(
    private _matchService = new MatcheService(),
    private _teamService = new TeamService(),
  ) {}

  getAllMatches(team: ITeam) {
    this._matchesHomeTeam = this._allMatches.filter((matche) => team.id === matche.homeTeamId);
  }

  getVictories() {
    return this._matchesHomeTeam
      .filter((matche) => matche.homeTeamGoals > matche.awayTeamGoals).length;
  }

  getDraws() {
    return this._matchesHomeTeam
      .filter((matche) => matche.homeTeamGoals === matche.awayTeamGoals).length;
  }

  getLosses() {
    return this._matchesHomeTeam
      .filter((matche) => matche.homeTeamGoals < matche.awayTeamGoals).length;
  }

  getGoalsFavor() {
    return this._matchesHomeTeam
      .reduce((goals, matche) => goals + matche.homeTeamGoals, 0);
  }

  getGoalsOwn() {
    return this._matchesHomeTeam
      .reduce((goals, matche) => goals + matche.awayTeamGoals, 0);
  }

  getClassification(name: string): ILeaderboard {
    const totalVictories = this.getVictories();
    const totalDraws = this.getDraws();
    const totalLosses = this.getLosses();
    const totalPoints = (totalVictories * 3) + totalDraws;
    const goalsFavor = this.getGoalsFavor();
    const goalsOwn = this.getGoalsOwn();
    return {
      name,
      totalPoints,
      totalGames: this._matchesHomeTeam.length,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: Number(((totalPoints / (this._matchesHomeTeam.length * 3)) * 100).toFixed(2)),
    };
  }

  getInfosTeam() {
    return this._allTeams.reduce((arrayInfos, team) => {
      this.getAllMatches(team);
      const infos = this.getClassification(team.teamName);
      arrayInfos.push(infos);
      return arrayInfos;
    }, [] as ILeaderboard[]);
  }

  async getInfosHomeTeam(): Promise<ServiceResponse<ILeaderboard[]>> {
    this._allTeams = (await this._teamService.getAll()).data;
    this._allMatches = (await this._matchService.getAll('true')).data;

    const infos = this.getInfosTeam();

    return { status: 'SUCCESSFUL', data: infos };
  }
}
