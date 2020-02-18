import Sequelize, { Model } from 'sequelize';

class HelpOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        questions: Sequelize.STRING,
        anwser: Sequelize.STRING,
        anwser_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}
export default HelpOrder;
