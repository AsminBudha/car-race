let container = document.getElementsByTagName('div')[0];
var startsound = new Audio('./music/bg-music.mp3');
// var startsound = new Audio('../music/123.mp3');

setTimeout(() => {
  app();
  }, 0);

app = function(){
  play();
  setTimeout(app,0 );
}  

play = function(){
  startsound.play();
}

width = window.innerWidth - 50 || document.body.clientWidth - 50;
height = window.innerHeight || document.body.clientHeight;
container.style.height = height + 'px';

document.getElementsByClassName('btn-race')[0].addEventListener('click', (e) => {
  window.location.href = 'game.html';
});