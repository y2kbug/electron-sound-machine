/**
 * Created by turing on 16/1/27.
 */
'use strict'

var electron = require('electron')

// 进程通信模块
var ipcMain = electron.ipcMain

// 控制应用程序生命周期模块
const app = electron.app

// 创建原生浏览器窗口
const BrowserWindow = electron.BrowserWindow

// 全局快捷键模块
const globalShortcut = electron.globalShortcut

// 快捷键配置模块
var configuration = require('./configuration')

// 保持一个对window对象的全局引用, 不然, 当 Javascript 被GC,
// window会被自动关闭
var mainWindow = null

// 设置window
var settingsWindow = null

console.log(process.versions['electron'])

// 设置全局快捷键
function setGlobalShortcuts () {
  globalShortcut.unregisterAll()
  var shortcutKeysSetting = configuration.readSettings('shortcutKeys')
  var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+'
  globalShortcut.register(shortcutPrefix + '1', function () {
    mainWindow.webContents.send('global-shortcut', 0)
  })
  globalShortcut.register(shortcutPrefix + '2', function () {
    mainWindow.webContents.send('global-shortcut', 1)
  })
}

// 主进程监听 'set-global-shortcuts' 消息
ipcMain.on('set-global-shortcuts', function () {
  console.log('set global shortcus')
  setGlobalShortcuts()
})

// 主进程监听 'open-settings-window' 消息
ipcMain.on('open-settings-window', function () {
  console.log('open settings window')
  if (settingsWindow) {
    return
  }
  settingsWindow = new BrowserWindow({
    frame: false,
    height: 200,
    resizable: false,
    width: 200
  })
  settingsWindow.loadURL('file://' + __dirname + '/App/settings.html')
  settingsWindow.on('closed', function () {
    settingsWindow = null
  })
})

// 主进程监听 'close-setting-window' 消息
ipcMain.on('close-settings-window', function () {
  console.log('close settings window')
  if (settingsWindow) {
    settingsWindow.close()
  }
})

// 主进程监听 'close-main-window' 消息
ipcMain.on('close-main-window', function () {
  console.log('App quit')
  app.quit()
})

// 当所有窗口被关闭了, 退出
app.on('window-all-close', function () {
  // 在 OS X 上, 通常用户在明确地按下 CMD + Q 之前
  // 应用会保持活动状态
  if (process.platform !== 'drawin') {
    console.log('App quit')
    app.quit()
  }
})

// 当 Electron 完成了初始化并且准备创建浏览器窗口时候
// 这个方法被调用
app.on('ready', function () {
  if (!configuration.readSettings('shortcutKeys')) {
    configuration.saveSettings('shortcutKeys', ['ctrl', 'shift'])
  }
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    frame: true,
    height: 700,
    resizable: true,
    width: 368
  })

  // 加载应用的 index.html
  mainWindow.loadURL('file://' + __dirname + '/app/index.html')
  // 打开开发工具
  mainWindow.openDevTools()
  // 当 window 被关闭，这个事件会被发出
  mainWindow.on('closed', function () {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 但这次不是。
    console.log('Window will close')
    mainWindow = null
  })

  setGlobalShortcuts()
})
