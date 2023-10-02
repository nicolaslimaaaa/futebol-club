import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';
import TeamModel from './TeamModel';

class MatcheModel extends Model<InferAttributes<MatcheModel>,
InferCreationAttributes<MatcheModel>> {
  declare id: CreationOptional<number>;

  declare homeTeamId: number;

  declare homeTeamGoals: number;

  declare awayTeamId: number;

  declare awayTeamGoals: number;

  declare inProgress: boolean;
}

MatcheModel.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  homeTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: {
        tableName: 'teams',
      },
      key: 'id',
    },
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: {
        tableName: 'teams',
      },
      key: 'id',
    },
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize: db,
  modelName: 'matches',
  timestamps: false,
  underscored: true,
});

/**
  * `Workaround` para aplicar as associations em TS:
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

TeamModel.hasMany(MatcheModel, {
  foreignKey: 'homeTeamId',
  as: 'homeMatches',
});

TeamModel.hasMany(MatcheModel, {
  foreignKey: 'awayTeamId',
  as: 'awayMatches',
});

MatcheModel.belongsTo(TeamModel, {
  foreignKey: 'homeTeamId',
  as: 'homeTeam',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

MatcheModel.belongsTo(TeamModel, {
  foreignKey: 'awayTeamId',
  as: 'awayTeam',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default MatcheModel;
