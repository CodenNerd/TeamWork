import { Router } from 'express';
import addUser from '../Controllers/addUser';
import Auth from '../Middleware/Auth';
import signIn from '../Controllers/signIn';
import createGif from '../Controllers/createGif';

const api = Router();

api.post('/auth/create-user', Auth, addUser);
api.post('/signin', signIn);
api.post('/auth/gifs', Auth, createGif)

export default api;
