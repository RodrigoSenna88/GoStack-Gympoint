import * as Yup from 'yup';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not found.' });
    }

    const checkin = await Checkin.create(req.body);

    return res.json(checkin);
  }

  async index(req, res) {
    const checkins = await Checkin.findAll();
    return res.json(checkins);
  }
}

export default new CheckinController();
