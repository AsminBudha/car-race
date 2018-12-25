let container = document.getElementsByTagName('div')[0];
let startsound = new Audio('./music/bg-music.mp3');
setInterval(() => {
  startsound.play();
}, 0);

width = window.innerWidth - 50 || document.body.clientWidth - 50;
height = window.innerHeight || document.body.clientHeight;
container.style.height = height + 'px';

document.getElementsByClassName('btn-race')[0].addEventListener('click', (e) => {
  window.location.href = 'game.html';
});
