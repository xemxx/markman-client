import { BrowserWindow, dialog } from 'electron'
import BaseWindow, { WindowType } from './base'
import {
  TITLE_BAR_HEIGHT,
  editorWinOptions,
  isWindows,
  //  isLinux
} from '../config'
// import path from 'path'
class EditorWindow extends BaseWindow {
  /**
   * @param {Accessor} accessor The application accessor for application instances.
   */
  constructor(accessor) {
    super(accessor)
    this.type = WindowType.EDITOR
  }

  /**
   * Creates a new editor window.
   * @param {*} [options] The BrowserWindow options.
   */
  createWindow(options = {}) {
    const { menu: appMenu } = this._accessor

    const winOptions = Object.assign(
      { width: 1200, height: 800 },
      editorWinOptions,
      options,
    )

    if (isWindows) {
      options.frame = false // 创建一个frameless窗口，详情：https://electronjs.org/docs/api/frameless-window
    }
    // if (isLinux) {
    //   winOptions.icon = path.join(__static, 'icons/png/128x128.png')
    // }

    let win = (this.browserWindow = new BrowserWindow(winOptions))
    this.id = win.id

    // Create a menu for the current window
    appMenu.addEditorMenu(win)

    win.once('ready-to-show', () => {
      win.show()
    })

    // 当页面加载完成时
    win.webContents.once('did-finish-load', () => {
      // Restore and focus window
      super.bringToFront()
    })

    // 页面崩溃提示框
    win.webContents.once('crashed', async (event, killed) => {
      const msg = `The renderer process has crashed unexpected or is killed (${killed}).`

      const { response } = await dialog.showMessageBox(win, {
        type: 'warning',
        buttons: ['Close', 'Reload', 'Keep It Open'],
        message: 'Mark Text has crashed',
        detail: msg,
      })

      if (win.id) {
        switch (response) {
          case 0:
            return this.emit('window-closed')
          case 1:
            return super.reload()
        }
      }
    })

    win.on('reload', () => {
      super.reload()
    })

    win.on('focus', () => {
      this.emit('window-focus')
    })

    // The window is now destroyed.
    win.on('closed', () => {
      this.emit('window-closed')
      // Free window reference
      win = null
    })

    win.on('resize', () => {
      win.webContents.send('m::resize-editor')
    })

    win.loadURL(this._buildUrlString() + '#/')
    win.setSheetOffset(TITLE_BAR_HEIGHT)

    return win
  }
}

export default EditorWindow
