import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';
import TeamModel from './TeamModel';

class MatchesModel extends Model<InferAttributes<MatchesModel>,
InferCreationAttributes<MatchesModel>> {
  declare id: CreationOptional<number>;

  declare homeTeamId: number;

  declare homeTeamGoals: number;

  declare awayTeamId: number;

  declare awayTeamGoals: number;

  declare inProgress: boolean;
}

MatchesModel.init({
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

TeamModel.hasMany(MatchesModel, {
  foreignKey: 'homeTeamId',
  as: 'homeMatches',
});

TeamModel.hasMany(MatchesModel, {
  foreignKey: 'awayTeamId',
  as: 'awayMatches',
});

MatchesModel.belongsTo(TeamModel, {
  foreignKey: 'homeTeamId',
  as: 'teams',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

MatchesModel.belongsTo(TeamModel, {
  foreignKey: 'awayTeamId',
  as: 'teams',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default MatchesModel;
