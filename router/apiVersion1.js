import { Router } from 'express';
import addUser from '../Controllers/addUser';
import Auth from '../Middleware/Auth';

const api = Router();

api.post('/auth/create-user', Auth, addUser);

export default api;
