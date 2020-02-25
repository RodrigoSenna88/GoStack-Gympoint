import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { student, plan, registration } = data;

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
        start: format(
          parseISO(registration.start_date),
          "'dia' dd 'de' MMMM 'de' yyyy'",
          {
            locale: pt,
          }
        ),
        end: format(
          parseISO(registration.end_date),
          "'dia' dd 'de' MMMM 'de' yyyy'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new RegistrationMail();
