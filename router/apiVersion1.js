import { Router } from 'express';
import addUser from '../Controllers/addUser';
import Auth from '../Middleware/Auth';
import signIn from '../Controllers/signIn'

const api = Router();

api.post('/auth/create-user', Auth, addUser);
api.post('/auth/signin', Auth, signIn)

export default api;
