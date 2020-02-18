import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { id } = req.params;
    // Verifica se o estudante existe
    const students = await Student.findByPk(req.student_id);
    if (!students) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const orders = await HelpOrder.findAll({ where: { student_id: id } });

    return res.json(orders);
  }
}
export default new HelpOrderController();
