import User from '../models/User.js';
import crypto from 'crypto';
import mailHandler from '../handlers/mailHandler.js';

const userController = {
    login: (req, res) => {
        const dados = {
            titulo: 'Login'
        };

        res.render('login', dados);
    },
    loginAction: (req, res) => {
        const auth = User.authenticate();

        auth(req.body.email, req.body.password, (error, result) => {
            if (!result) {
                req.flash('error', 'Seu e-mail e/ou senha estão errados!');
                return res.redirect('/users/login');
            }

            req.login(result, () => {});

            req.flash('success', 'Login efetuado com sucesso!');
            return res.redirect('/');
        });
    },
    register: (req, res) => {
        const dados = {
            titulo: 'Cadastro'
        };

        res.render('register', dados);
    },
    registerAction: (req, res) => {
        User.register(new User(req.body), req.body.password, (error) => {
            if (error) {
                req.flash('error', 'Ocorreu um erro, tente mais tarde.');
                console.log(`Erro ao registrar: ${error}`);
                res.redirect('/');
                return;
            }

            req.flash('success', 'registro efetuado com sucesso, faça o login');
            res.redirect('/user/login');
        });
    },
    profile: (req, res) => {
        const dados = {
            titulo: 'Meu Perfil',
            name: req.user.name,
            email: req.user.email
        }

        res.render('profile', dados);
    },
    profileAction: async (req, res) => {
        try {
            const user = await User.findOneAndUpdate(
                {_id: req.user._id},
                {name: req.body.name, email: req.body.email},
                {new: true, runValidators: true}
            );
        } catch (error) {
            req.flash('error', `Ocorreu algum erro ${error.message}`);
            return res.redirect('/profile');
        }

        req.flash('success', 'Dados atualizados com sucesso!');
        res.redirect('/profile');
    },
    forget: (req, res) => {
        res.render('forget');
    },
    forgetAction: async (req, res) => {
        const user = await User.findOne({email: req.body.email}).exec();

        if (!user) {
            req.flash('error', 'E-mail não cadastrado!');
            return res.render('forget');
        }

        user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetLink = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;
        const html = `Para redefinir sua senha clique no link abaixo:<br><a href="${resetLink}">Redefinir Senha</a>`;
        const text = `Acesse o seguinte link para redefinir sua senha:\n${resetLink}`;

        mailHandler.send({
            to: `${user.name} <${user.email}>`,
            subject: 'Redefinir Senha',
            html,
            text
        });

        req.flash('success', 'Te enviamos um e-mail de redefinição de senha');
        res.redirect('/users/login');
    },
    resetPass: async (req, res) => {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {$gt: Date.now()}
        }).exec();

        if (!user) {
            req.flash('error', 'Token expirado!');
            return res.redirect('/users/forget');
        }

        res.render('forgetPassword');
    },
    resetPassAction: async (req, res) => {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {$gt: Date.now()}
        }).exec();

        if (!user) {
            req.flash('error', 'Token expirado!');
            return res.redirect('/users/forget');
        }

        if (req.body.password != req.body['password-confirm']) {
            req.flash('error', 'Senhas não correspondem!');
            return res.redirect('back');
        }

        user.setPassword(req.body.password, async () => {
            await user.save();

            req.flash('success', 'Senha alterada com successo!');
            res.redirect('/');
        });
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    }
}

export default userController;
