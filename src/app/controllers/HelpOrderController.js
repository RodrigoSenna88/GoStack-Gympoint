import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1, quantity = 20 } = req.query;

    // Verifica se o estudante existe

    const students = await Student.findByPk(req.student_id);
    if (!students) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const { rows: orders } = await HelpOrder.findAll({
      where: { student_id: id },
      limit: quantity,
      offset: (page - 1) * quantity,
      order: [['created_at', 'DESC']],
    });

    return res.json(orders);
  }

  /**
   *  Create help orders
   */
  async store(req, res) {
    const validateSchema = requestBody => {
      const schema = Yup.object().shape({
        question: Yup.string().required(),
      });

      return schema.isValid(requestBody);
    };

    if (!(await validateSchema(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Check student exists
    const { id } = req.params;
    const students = await Student.findByPk(id);

    if (!students) {
      return res.status(400).json({ error: 'No stundent found.' });
    }

    const helpOrder = await HelpOrder.create({
      student_id: id,
      question: req.body.question,
    });

    return res.json(helpOrder);
  }
}
export default new HelpOrderController();
