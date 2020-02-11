import Help_Order from '../models/Help_Order';
import Student from '../models/Student';
import Checkin from '../models/Checkin';

class Help_OrderController {
  async index(req, res) {
    const { id } = req.params;

    // Verifica se o estudante existe
    const students = await Student.findByPk(id);
    if (!students) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    // Verifica se o estudante tem checkin
    const checkinStundent = await Checkin.findByPk(id);
    if (!checkinStundent) {
      return res.status(400).json({ error: 'No checkins stundent found.' });
    }

    const orders = await Help_Order.findByPk({ where: { student_id: id } });

    return res.json(orders);
  }
}
export default new Help_OrderController();
