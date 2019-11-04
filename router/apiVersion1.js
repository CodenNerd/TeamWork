import { Router } from 'express';
import addUser from '../Controllers/addUser'

const api = Router();

api.post('/auth/create-user', addUser);

export default api;
