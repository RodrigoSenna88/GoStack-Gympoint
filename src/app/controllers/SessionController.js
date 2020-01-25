import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';
import Student from '../models/Student';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, admin } = user;

    if (admin === true) {
      return res.json({
        user: {
          id,
          name,
          email,
        },

        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    }
    const student = await Student.findOne({ where: { email } });

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    if (!(await student.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new SessionController();
