import * as Yup from 'yup';
import { addMonths, parseISO, isAfter } from 'date-fns';

import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import Mail from '../../lib/Mail';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    // verificar se estudante existe

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not found.' });
    }

    // verificar se o plan existe

    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res.status(400).json({ error: 'Plan does not found.' });
    }

    // verificar a data

    const isFuture = isAfter(parseISO(start_date), new Date());

    if (!isFuture) {
      return res.json({ error: 'Start date is incorrect.' });
    }

    // criação do end_date em função do plano

    const end_date = addMonths(parseISO(start_date), Plan.duration);

    // criação do preço total do plano

    const price = Plan.duration * Plan.price;

    // verificação se matricula existe

    const registerExists = await Registration.findByPk(student_id);

    if (registerExists) {
      return res.status(400).json({ error: 'Registrations already exists.' });
    }

    const register = await Registration.create(req.body, end_date, price, {
      include: [
        {
          model: Student,
          attributes: ['name', 'email'],
        },
      ],
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula realizada.',
      text: 'Sua matrícula na GymPint foi realizada com sucesso!',
    });

    return res.json(register);
  }

  async index(req, res) {
    const registrations = await Registration.findAll();
    return res.json(registrations);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number().positive(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    await registration.update(req.body);

    return res.json(registration);
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    await registration.destroy();

    return res.json(registration);
  }
}

export default new RegistrationController();
