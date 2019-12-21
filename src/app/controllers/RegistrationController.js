import * as Yup from 'yup';

import Registration from '../models/Registration';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll();
    return res.json(registrations);
  }
}

export default new RegistrationController();
