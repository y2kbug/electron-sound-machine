'use strict'

var path = require('path')
const electron = require('electron')
const ipcRender = electron.ipcRenderer
var remote = electron.remote
var Tray = remote.Tray
var Menu = remote.Menu

var soundButtons = document.querySelectorAll('.button-sound')
var closeEl = document.querySelector('.close')
var settingsEl = document.querySelector('.settings')

var trayIcon = null

for (var i = 0; i < soundButtons.length; i++) {
  var soundButton = soundButtons[i]
  var soundName = soundButton.attributes['data-sound'].value
  prepareButton(soundButton, soundName)
}

function prepareButton (buttonEl, soundName) {
  buttonEl.querySelector('span').style.backgroundImage = 'url("img/icons/' + soundName + '.png")'
  var audio = new Audio(__dirname + '/wav/' + soundName + '.wav')
  buttonEl.addEventListener('click', function () {
    audio.currentTime = 0
    audio.play()
  })
}

closeEl.addEventListener('click', function () {
  ipcRender.send('close-main-window')
})

settingsEl.addEventListener('click', function () {
  ipcRender.send('open-settings-window')
})

ipcRender.on('global-shortcut', function (event, arg) {
  var clickEvent = new MouseEvent('click')
  soundButtons[arg].dispatchEvent(clickEvent)
  console.log('global-shortcut')
})

if (process.platform === 'darwin') {
  trayIcon = new Tray(path.join(__dirname, 'img/tray-iconTemplate.png'))
} else {
  trayIcon = new Tray(path.join(__dirname, 'img/tray-icon-alt.png'))
}

var trayMenuTemplate = [
  {
    label: 'Sound machine',
    enabled: false
  },
  {
    label: 'Settings',
    click: function () {
      ipcRender.send('open-settings-window')
    }
  },
  {
    label: 'Quit',
    click: function () {
      ipcRender.send('close-main-window')
    }
  }
]

var trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
trayIcon.setContextMenu(trayMenu)
