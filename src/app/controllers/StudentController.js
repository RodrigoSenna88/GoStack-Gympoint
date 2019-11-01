import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const {
      id,
      name,
      email,
      age,
      weight,
      height,
      provider,
    } = await Student.create(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
      provider,
    });
  }

  async update(req, res) {
    const { email, oldpassword } = req.body;

    const student = await Student.findOne(req.studentId);

    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({ error: 'Student already exists.' });
      }
    }

    if (oldpassword && !(await student.checkPassword(oldpassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    const { id, name, age, weight, height, provider } = await student.update(
      req.body
    );

    return res.json({ id, name, email, age, weight, height, provider });
  }
}

export default new StudentController();
