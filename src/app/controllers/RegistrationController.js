import * as Yup from 'yup';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number({
        where: { Student: req.params.student_id },
      }).required(),
      plan_id: Yup.number({ where: { Plan: req.params.plan_id } })
        .positive()
        .required(),
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const registerExists = await Registration.findOne({
      where: { student_id: req.body.student_id },
    });

    if (registerExists) {
      return res.status(400).json({ error: 'Studens already registred.' });
    }

    const {
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    } = await Registration.create(req.body);

    return res.json({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async index(req, res) {
    const registrations = await Registration.findAll();
    return res.json(registrations);
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    await registration.destroy();

    return res.json(registration);
  }
}

export default new RegistrationController();
