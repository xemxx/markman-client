'use strict'

import App from './app'

import { app, protocol } from 'electron'
import Accessor from './app/accessor'
import { isDevelopment, isWindows, userDataPath } from './config'
import { installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

if (isDevelopment && !process.env.IS_TEST) {
  app.on('ready', async () => {
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  })
}

// Make a single instance application.
if (!process.mas && !isDevelopment) {
  const gotSingleInstanceLock = app.requestSingleInstanceLock()
  if (!gotSingleInstanceLock) {
    process.stdout.write('Other instance detected: exiting...\n')
    app.exit()
  }
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (isWindows) {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

const accessor = new Accessor({
  userDataPath: userDataPath
})

const markman = new App(accessor)
markman.init()