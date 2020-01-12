import * as Yup from 'yup';
import { addMonths, parseISO, isAfter, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

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

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not found.' });
    }

    // verificar a data

    const isFuture = isAfter(parseISO(start_date), new Date());

    if (!isFuture) {
      return res.json({ error: 'Start date is incorrect.' });
    }

    // criação do end_date em função do plano

    const end_date = addMonths(new Date(start_date), plan.duration);

    console.log(end_date);

    // criação do preço total do plano

    const price = plan.duration * plan.price;

    console.log(price);

    // verificação se matricula existe

    const registerExists = await Registration.findByPk(student_id);

    if (registerExists) {
      return res.status(400).json({ error: 'Registrations already exists.' });
    }

    const registration = await Registration.create(req.body, end_date, price, {
      include: [
        {
          model: Student,
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula realizada.',
      template: 'registrations',
      context: {
        student: student.name,
        plan: plan.title,
        duration: plan.duration,
        price: plan.price,
        price_total: registration.price,
        start: format(registration.start_date, "'dia' dd 'de' MMMM'", {
          locale: pt,
        }),
        end: registration.end_date,
      },
    });

    return res.json(registration);
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
