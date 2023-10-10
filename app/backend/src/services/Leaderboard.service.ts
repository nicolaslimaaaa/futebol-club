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
  private _matchesAwayTeam: MatcheModel[] = [];
  private _typeTeam = '';
  private _infos: ILeaderboard = {
    name: '',
    totalPoints: 0,
    totalGames: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
    goalsBalance: 0,
    efficiency: 0,
  };

  constructor(
    private _matchService = new MatcheService(),
    private _teamService = new TeamService(),
  ) {}

  getAllMatches(team: ITeam) {
    if (this._typeTeam === 'home') {
      this._matchesHomeTeam = this._allMatches.filter((matche) => team.id === matche.homeTeamId);
    } else {
      this._matchesAwayTeam = this._allMatches.filter((matche) => team.id === matche.awayTeamId);
    }
  }

  getVictories() {
    if (this._typeTeam === 'home') {
      return this._matchesHomeTeam
        .filter((matche) => matche.homeTeamGoals > matche.awayTeamGoals).length;
    }

    return this._matchesAwayTeam
      .filter((matche) => matche.homeTeamGoals < matche.awayTeamGoals).length;
  }

  getDraws() {
    if (this._typeTeam === 'home') {
      return this._matchesHomeTeam
        .filter((matche) => matche.homeTeamGoals === matche.awayTeamGoals).length;
    }

    return this._matchesAwayTeam
      .filter((matche) => matche.homeTeamGoals === matche.awayTeamGoals).length;
  }

  getLosses() {
    if (this._typeTeam === 'home') {
      return this._matchesHomeTeam
        .filter((matche) => matche.homeTeamGoals < matche.awayTeamGoals).length;
    }

    return this._matchesAwayTeam
      .filter((matche) => matche.homeTeamGoals > matche.awayTeamGoals).length;
  }

  getGoalsFavor() {
    if (this._typeTeam === 'home') {
      return this._matchesHomeTeam
        .reduce((goals, matche) => goals + matche.homeTeamGoals, 0);
    }

    return this._matchesAwayTeam
      .reduce((goals, matche) => goals + matche.awayTeamGoals, 0);
  }

  getGoalsOwn() {
    if (this._typeTeam === 'home') {
      return this._matchesHomeTeam
        .reduce((goals, matche) => goals + matche.awayTeamGoals, 0);
    }

    return this._matchesAwayTeam
      .reduce((goals, matche) => goals + matche.homeTeamGoals, 0);
  }

  getTotalGames() {
    if (this._typeTeam === 'home') {
      return this._matchesHomeTeam.length;
    }

    return this._matchesAwayTeam.length;
  }

  getTotalPoints() {
    const totalVictories = this.getVictories();
    const totalDraws = this.getDraws();
    const totalPoints = (totalVictories * 3) + totalDraws;

    return totalPoints;
  }

  getEfficiency() {
    if (this._typeTeam === 'home') {
      return Number(((this.getTotalPoints() / (this._matchesHomeTeam.length * 3)) * 100)
        .toFixed(2));
    }

    return Number(((this.getTotalPoints() / (this._matchesAwayTeam.length * 3)) * 100)
      .toFixed(2));
  }

  getClassification(name: string): ILeaderboard {
    return {
      name,
      totalPoints: this.getTotalPoints(),
      totalGames: this.getTotalGames(),
      totalVictories: this.getVictories(),
      totalDraws: this.getDraws(),
      totalLosses: this.getLosses(),
      goalsFavor: this.getGoalsFavor(),
      goalsOwn: this.getGoalsOwn(),
      goalsBalance: this.getGoalsFavor() - this.getGoalsOwn(),
      efficiency: this.getEfficiency(),
    };
  }

  getInfos() {
    return this._allTeams.reduce((arrayInfos, team) => {
      this.getAllMatches(team);
      const infos = this.getClassification(team.teamName);
      arrayInfos.push(infos);
      return arrayInfos;
    }, [] as ILeaderboard[]);
  }

  async getInfosTeams(typeTeam: string): Promise<ServiceResponse<ILeaderboard[]>> {
    this._allTeams = (await this._teamService.getAll()).data;
    this._allMatches = (await this._matchService.getAll('false')).data;
    this._typeTeam = typeTeam;

    const infos = this.getInfos()
      .sort((a, b) => b.goalsFavor - a.goalsFavor)
      .sort((a, b) => b.goalsBalance - a.goalsBalance)
      .sort((a, b) => b.totalVictories - a.totalVictories)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return { status: 'SUCCESSFUL', data: infos };
  }

  static calculateInfos(homeTeam: ILeaderboard, infoAwayTeams: ILeaderboard) {
    const totalPoints = homeTeam.totalPoints + infoAwayTeams.totalPoints;
    const totalGames = homeTeam.totalGames + infoAwayTeams.totalGames;
    const efficiency = Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));

    return {
      name: homeTeam.name,
      totalPoints,
      totalGames,
      totalVictories: homeTeam.totalVictories + infoAwayTeams.totalVictories,
      totalDraws: homeTeam.totalDraws + infoAwayTeams.totalDraws,
      totalLosses: homeTeam.totalLosses + infoAwayTeams.totalLosses,
      goalsFavor: homeTeam.goalsFavor + infoAwayTeams.goalsFavor,
      goalsOwn: homeTeam.goalsOwn + infoAwayTeams.goalsOwn,
      goalsBalance: homeTeam.goalsBalance + infoAwayTeams.goalsBalance,
      efficiency,
    };
  }

  async getInfosComplete(): Promise<ServiceResponse<ILeaderboard[]>> {
    const infosHome = (await this.getInfosTeams('home')).data;
    const infosAway = (await this.getInfosTeams('away')).data;

    const infos = infosHome.map((homeTeam) => {
      const infoAwayTeams = infosAway
        .find((awayTeam) => awayTeam.name === homeTeam.name);

      return Leaderboard.calculateInfos(homeTeam, infoAwayTeams || this._infos);
    }).sort((a, b) => b.goalsFavor - a.goalsFavor)
      .sort((a, b) => b.goalsBalance - a.goalsBalance)
      .sort((a, b) => b.totalVictories - a.totalVictories)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return { status: 'SUCCESSFUL', data: infos };
  }
}
