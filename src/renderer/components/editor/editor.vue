<template>
  <div ref="markdown"></div>
</template>

<script>
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import emitter from '@/emitter'
import { nextTick } from 'vue'

export default {
  props: {
    markdown: {
      type: String,
      default: function () {
        return ''
      },
    },
  },
  watch: {},
  created() {
    nextTick(() => {
      // listen for emitter events.
      emitter.on('note-loaded', this.setMarkdownToEditor)
      emitter.on('query-close-note', this.showCloseQuery)

      const options = {
        value: this.markdown,
        height: '100%',
        width: '100%',
        toolbarConfig: {
          hide: false,
          pin: false,
        },
        tab: '\t',
        counter: {
          enable: true,
          type: 'md',
        },
        typewriterMode: false,
        cache: { enable: false },
        input: value => {
          const { dispatch } = this.$store
          dispatch('editor/listenContentChange', {
            markdown: value,
          })
        },
      }

      this.vditor = new Vditor(this.$refs.markdown, options)

      // listen for main thread ipc message
      this.listen()
    })
  },
  beforeUnmount() {
    emitter.off('note-loaded', this.setMarkdownToEditor)
    emitter.off('query-close-note', this.showCloseQuery)

    this.vditor.destroy()
  },

  methods: {
    listen() {},

    // listen for checkout a new note.
    setMarkdownToEditor({ markdown }) {
      const { vditor } = this
      if (vditor) {
        vditor.setValue(markdown, true)
      }
    },

    showCloseQuery(id) {
      this.$confirm({
        content: '当前笔记改动是否保存？',
        title: '提示',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          return this.$store.dispatch('editor/saveNote').then(() => {
            return this.$store.dispatch('editor/loadNote', id)
          })
        },
        onCancel: () => {
          return
        },
      })
    },
  },
}
</script>

<style lang="stylus" scope></style>
