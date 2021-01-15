import User from '../models/User.js';

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
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    }
}

export default userController;
