import * as Yup from 'yup';

import { subDays, isAfter } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Registration from '../models/Registration';

class CheckinController {
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

    // List Checkins by student ID
    const checkins = await Checkin.findAll({
      where: { student_id: id },
      attributes: ['id', 'student_id', 'created_at'],
      order: [['created_at', 'DESC']],
    });

    /*
    const countCheckins = await checkins.length;
    const jsons = new Array(0);
    jsons.push(checkins);
    jsons.push(countCheckins);
    return res.json(jsons);
    */

    return res.json(checkins);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id } = req.body;

    // verificar se estudante existe

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not found.' });
    }

    // verificar se estudante pode entrar na academia

    const checkStundent = await Registration.findOne({
      where: { student_id },
    });

    if (!checkStundent || !isAfter(checkStundent.end_date, new Date())) {
      return res
        .status(401)
        .json({ error: 'Your registration is not active to join the gym.' });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id,
        created_at: { [Op.between]: [subDays(new Date(), 7), new Date()] },
      },
    });

    if (checkins.length >= 5) {
      // eslint-disable-next-line no-unused-vars
      const lastCheckin = await Checkin.findOne({
        where: { student_id },
        offset: 4,
      });

      return res.status(401).json({
        error: `You can only check-in 5 times in 7 days.`,
      });
    }

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }
}

export default new CheckinController();
