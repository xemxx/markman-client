// --- menu -------------------------------------

export const exportFile = (win, type) => {
  if (win && win.webContents) {
    console.log('export-file', type)
    //win.webContents.send('mt::show-export-dialog', type)
  }
}

export const save = win => {
  if (win && win.webContents) {
    win.webContents.send('m::file-save')
  }
}

export const autoSave = menuItem => {
  const { checked } = menuItem
  console.log('set autoSave', checked)
  //  ipcMain.emit('set-user-preference', { autoSave: checked })
}