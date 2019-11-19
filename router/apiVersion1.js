import { Router } from 'express';
import addUser from '../Controllers/addUser';
import Auth from '../Middleware/Auth';
import signIn from '../Controllers/signIn';
import createGif from '../Controllers/createGif';
import shareGif from '../Controllers/shareGif';
import createArticle from '../Controllers/createArticle';
import shareArticle from '../Controllers/shareArticle';
import editArticle from '../Controllers/editArticle';
import deleteArticle from '../Controllers/deleteArticle';
import deleteGif from '../Controllers/deleteGif';
import createArticleComment from '../Controllers/createArticleComment';
import createGifComment from '../Controllers/createGifComment';
import getAllPosts from '../Controllers/getAllPosts';
import getOneArticle from '../Controllers/getOneArticle';
import getOneGif from '../Controllers/getOneGif';
import getAllEmployees from '../Controllers/getAllEmployees';
import getOneEmployee from '../Controllers/getOneEmployee';
import likePost from '../Controllers/likePost';
import deleteLike from '../Controllers/deleteLike';
import getLikes from '../Controllers/getLikes';
import deleteComment from '../Controllers/deleteComment';
import getTagArticles from '../Controllers/getTagArticle';
import flagPost from '../Controllers/flagPost';
import getFlaggedPosts from '../Controllers/getFlaggedPosts';
import updateFlaggedPost from '../Controllers/updateFlaggedPost';
import deleteFlaggedPost from '../Controllers/deleteFlaggedPost';
import searchForPosts from '../Controllers/searchForPosts';
import ScreenObscenity from '../Middleware/ScreenObscenity';

const api = Router();

api.post('/auth/create-user', Auth, addUser);
api.post('/auth/signin', signIn);
api.post('/gifs', Auth, createGif, ScreenObscenity);
api.post('/gifs/:gifId/share/:recipientId', Auth, shareGif);
api.post('/articles', Auth, createArticle);
api.post('/articles/:articleId/share/:recipientId', Auth, shareArticle);

api.patch('/articles/:articleId', Auth, editArticle);

api.delete('/articles/:articleId', Auth, deleteArticle);
api.delete('/gifs/:gifId', Auth, deleteGif);

api.post('/articles/:articleId/comments', Auth, createArticleComment);
api.post('/gifs/:gifId/comments', Auth, createGifComment);

api.get('/feed', Auth, getAllPosts);
api.get('/articles/:articleId', Auth, getOneArticle);
api.get('/gifs/:gifId', Auth, getOneGif);

api.get('/employees', Auth, getAllEmployees);
api.get('/employees/:employeeId', Auth, getOneEmployee);

api.post('/posts/:postId/likes', Auth, likePost);
api.delete('/posts/:postId/likes/:likeId', Auth, deleteLike);
api.get('/posts/:postId/likes', Auth, getLikes);

api.delete('/posts/:postId/comments/:commentId', Auth, deleteComment);

api.get('/articles/tags/:tag', Auth, getTagArticles);

api.post('/posts/:postId/flags', Auth, flagPost);
api.get('/posts/flags', Auth, getFlaggedPosts);
api.patch('/posts/flags/:flagId', Auth, updateFlaggedPost);
api.delete('/posts/flags/:flagId', Auth, deleteFlaggedPost);

api.post('/posts/search', Auth, searchForPosts);

export default api;
