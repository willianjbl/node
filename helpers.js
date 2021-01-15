const helper = {
    defaultPageTitle: "Título do site",
    menu: [
        {description: 'Home', slug: '/', guest: true, loggedIn: true},
        {description: 'Login', slug: '/users/login', guest: true, loggedIn: false},
        {description: 'Registro', slug: '/users/register', guest: true, loggedIn: false},
        {description: 'Adicionar post', slug: '/post/add', guest: false, loggedIn: true},
        {description: 'Sair', slug: '/users/logout', guest: false, loggedIn: true}
    ]
};

export default helper;
