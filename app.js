import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mustacheExpress from 'mustache-express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'express-flash';
import passport from 'passport';
import passportLocal from 'passport-local';

import router from './routes/index.js';
import helper from './helpers.js';
import errorHandler from './handlers/errorHandler.js';

import dotenv from 'dotenv';
dotenv.config({path: 'variables.env'});

// Configurações
const __dirname = path.resolve();
const __filename = fileURLToPath(import.meta.url);
const app = express();
const LocalStrategy = passportLocal.Strategy;

app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
import User from './models/User.js';
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.h = {... helper};
    res.locals.flash = req.flash();
    res.locals.user = req.user;

    if (req.isAuthenticated()) {
        res.locals.h.menu = res.locals.h.menu.filter(i => i.loggedIn);
    } else {
        res.locals.h.menu = res.locals.h.menu.filter(i => i.guest);
    }

    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use('/', router);
app.use(errorHandler.notFound);

app.engine('mst', mustacheExpress(__dirname + '/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');

export default app;
