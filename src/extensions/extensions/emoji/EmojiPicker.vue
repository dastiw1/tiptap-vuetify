<template>
  <div>
    <v-menu
      :value="value"
      :activator="activator"
      attach=".tiptap-vuetify-editor"
      :close-on-content-click="false"
      offset-x
      offset-y
    >
      <v-card elevation="0">
        <v-emoji-picker @select="selectEmoji" />
      </v-card>
    </v-menu>
  </div>
</template>
<script lang="ts">
import { DOMParser } from 'prosemirror-model'
import VEmojiPicker from 'v-emoji-picker'
import Vue from 'vue'
import { mixins } from 'vue-class-component'
import { VMenu, VCard } from 'vuetify/lib'
import { Component, Prop } from 'vue-property-decorator'
import I18nMixin from '~/mixins/I18nMixin'
export const PROPS = {
  CONTEXT: 'context' as const,
  EDITOR: 'editor' as const
}
Vue.use(VEmojiPicker)

function elementFromString (value) {
  const element = document.createElement('div')
  element.innerHTML = value.trim()

  return element
}

function insertHTML ({ state, view }, value) {
  const { selection } = state
  const element = elementFromString(value)
  const slice = DOMParser.fromSchema(state.schema).parseSlice(element)
  const transaction = state.tr.insert(selection.anchor, slice.content)

  view.dispatch(transaction)
}

@Component({
  components: { VMenu, VCard }
})
export default class EmojiPicker extends mixins(I18nMixin) {
  @Prop({
    type: Object,
    required: true
  })
  readonly [PROPS.CONTEXT]: any

  @Prop({
    type: Object,
    required: true
  })
  readonly [PROPS.EDITOR]: any

  data () {
    return {
      value: true
    }
  }
  get activator () {
    const el = document.querySelector('.tiptap-vuetify-editor__toolbar .mdi-emoticon-outline')

    return el?.closest('.tiptap-vuetify-editor__action-render-btn')
  }

  selectEmoji (emoji) {
    this.editor.focus()

    insertHTML(this.editor, emoji.data)
  }

  close () {
    this.$destroy()
    this.$el.parentNode!.removeChild(this.$el)
  }
}
</script>

<style lang="stylus">
  .tiptap-vuetify-editor
    #EmojiPicker
      max-width: 100%
</style>
