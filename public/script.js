const nav = document.querySelector('.menu--list');
const menu = document.querySelector('.menu');
const close = document.querySelector('.close');
const a = document.querySelectorAll('li')

menu.addEventListener('click', () => {
    nav.classList.add('nav--visible');
    menu.classList.add('menu--hide');
    close.classList.add('close--show');
});

close.addEventListener('click', () => {
    nav.classList.remove('nav--visible');
    menu.classList.remove('menu--hide');
    close.classList.remove('close--show');
});

a.forEach(i => {
    i.addEventListener('click', () => {
        nav.classList.remove('nav--visible');
        menu.classList.remove('menu--hide');
        close.classList.remove('close--show');
    })
})