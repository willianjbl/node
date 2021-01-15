const authMiddleware = {
    isLogged : (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.flash('error', 'Ops! você não tem permissão para acessar essa página');
            return res.redirect('/users/login');
        }
    
        next();
    },
    changePassword : (req, res) => {
        if (req.body.password != req.body['password-confirm']) {
            req.flash('error', 'Senhas não correspondem!');
            return res.redirect('/profile');
        }

        req.user.setPassword(req.body.password, async () => {
            await req.user.save();

            req.flash('success', 'Senha alterada com successo!');
            res.redirect('/');
        });
    }
}

export default authMiddleware;
