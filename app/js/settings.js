'use strict'

const ipcRender = require('electron').ipcRenderer

var closeEl = document.querySelector('.close')
closeEl.addEventListener('click', function () {
  ipcRender.send('close-settings-window')
})

var configuration = require('../configuration')

var modifierCheckboxes = document.querySelectorAll('.global-shortcut')

for (var i = 0; i < modifierCheckboxes.length; i++) {
  var shortcutKeys = configuration.readSettings('shortcutKeys')
  var modifierKey = modifierCheckboxes[i].attributes['data-modifier-key'].value
  modifierCheckboxes[i].checked = shortcutKeys.indexOf(modifierKey) !== -1

  modifierCheckboxes[i].addEventListener('click', function (e) {
    bindModifierCheckboxes(e)
  })
}

function bindModifierCheckboxes (e) {
  var shortcutKeys = configuration.readSettings('shortcutKeys')
  var modifierKey = e.target.attributes['data-modifier-key'].value

  if (shortcutKeys.indexOf(modifierKey) !== -1) {
    var shortcutKeyIndex = shortcutKeys.indexOf(modifierKey)
    shortcutKeys.splice(shortcutKeyIndex, 1)
  } else {
    shortcutKeys.push(modifierKey)
  }

  configuration.saveSettings('shortcutKeys', shortcutKeys)
  ipcRender.send('set-global-shortcuts')
}
