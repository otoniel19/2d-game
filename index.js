const cnv = document.querySelector('canvas')
const ctx = cnv.getContext('2d')

const playerSprite = new Image()
playerSprite.src = 'img/monster.png'

const background = new Image()
background.src = 'img/scene.png'

//sprites do jogo
var GameSprites = []

var Play = {
  img: playerSprite,
  x: 0,
  y: 0,
  width: 64,
  height: 64
}

var Cam = {
  img: background,
  x: 0,
  y: 0,
  width: cnv.width,
  height: cnv.height,
  leftEdge: function() {
    return this.x + (this.width * 0.25);
  },
  rightEdge: function() {
    return this.x + (this.width * 0.75);
  },
  topEdge: function() {
    return this.y + (this.height * 0.25);
  },
  bottomEdge: function() {
    return this.y + (this.height * 0.75);
  }
}

var World = {
  img: background,
  x: 0,
  y: 0,
  width: 800,
  height: 600
}

var speed = 2

GameSprites.push(World, Play)

//centraliza o personagem e camera
Cam.x = (World.width - Cam.x) / 2
Cam.y = (World.height - Cam.y) / 2
Play.x = (World.width - Play.x) / 2
Play.y = (World.height - Play.y) / 2

const stick = new JoyStick('stick', {}, data => {
  const is = stick
  if (is.GetPosX() > 100) {
    Play.x += speed
    Cam.x += speed
    playerSprite.src='img/monster.png'
  }
  if (is.GetPosX() < 100) {
    Play.x -= speed
    Cam.x -= speed
    playerSprite.src='img/monster2.png'
  }
  if (is.GetPosY() > 100) {
    Play.y += speed
    Cam.y += speed
  }
  if (is.GetPosY() < 100) {
    Play.y -= speed
    Cam.y -= speed
  }
})

function updateGame() {
  //matem o personagem e camera centralizados
  if (Play.x < Cam.leftEdge()) {
    Cam.x = Play.x - (Cam.width * 0.25);
  }
  if (Play.x + Play.width > Cam.rightEdge()) {
    Cam.x = Play.x + Play.width - (Cam.width * 0.75);
  }
  if (Play.y < Cam.topEdge()) {
    Cam.y = Play.y - (Cam.height * 0.25);
  }
  if (Play.y + Play.height > Cam.bottomEdge()) {
    Cam.y = Play.y + Play.height - (Cam.height * 0.75);
  }
  
  //limites de visão para não bugar o mapa
  if(Cam.x >= 400) Cam.x = 400
  if(Cam.x <= 0) Cam.x = 0
  if(Cam.y >= 100) Cam.y = 100
  if(Cam.y <= 0) Cam.y = 2
  
  //limite de posição para não sair pra fora do mapa
  if(Play.x <= 0) Play.x = 2
  if(Play.x >= 740) Play.x = 740
  if(Play.y >= 542) Play.y = 542
  if(Play.y <= -4) Play.y = -4
}

function renderGame() {
  ctx.save()
  //mexe a câmera
  ctx.translate(-Cam.x, -Cam.y)
  for (var i in GameSprites) {
    const sp = GameSprites[i]
    ctx.drawImage(sp.img, 0, 0, sp.width, sp.height, sp.x, sp.y, sp.width, sp.height)
  }
  ctx.restore()
}

function main() {
  updateGame()
  renderGame()
  requestAnimationFrame(main, cnv)
}

background.onload = () => main()