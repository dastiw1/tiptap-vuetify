import VuetifyIcon from '~/extensions/nativeExtensions/icons/VuetifyIcon'
import AbstractExtension from '~/extensions/AbstractExtension'
import ExtensionActionInterface from '~/extensions/actions/ExtensionActionInterface'
import { VuetifyIconsGroups } from '~/configs/theme'
import ExtensionActionRenderBtn from '~/extensions/actions/renders/btn/ExtensionActionRenderBtn.ts'
import EmojiPicker from '~/extensions/extensions/emoji/EmojiPicker.vue'
import Vue from 'vue'
import I18nText from '~/i18n/I18nText'

// A class must inherit from an abstract class
export default class Emoji extends AbstractExtension {
  public picker: EmojiPicker;

  // Actions list
  get availableActions (): ExtensionActionInterface[] {
    // For example, you can make this extension add a several buttons (array items)
    return [
      {
        render: new ExtensionActionRenderBtn({
          tooltip: (context, options) => new I18nText(
            options.isActive(context)
              ? 'extensions.Emoji.buttons.isActive.tooltip'
              : 'extensions.Emoji.buttons.notActive.tooltip'
          ),
          // Button's icons for different icons groups. Usually for your extensions you only need one kind of icon,
          // but here is an example of how to make support for two types
          icons: {
            [VuetifyIconsGroups.fa]: new VuetifyIcon('fa fa-grin'),
            [VuetifyIconsGroups.mdi]: new VuetifyIcon('mdi-emoticon-outline')
          },
          // Button's click handler
          onClick: ({ editor, context }) => {
            const EmojiPickerComponent = Vue.extend(EmojiPicker)

            const instance = new EmojiPickerComponent({
              vuetify: Vue.prototype.tiptapVuetifyPlugin.vuetify,
              propsData: {
                context,
                editor
              }
            })

            instance.$mount()
            document.querySelector('body')!.appendChild(instance.$el)
            context.picker = instance
          },
          // Is the button active? This affects the style of the button.
          isActive: () => {
            // @ts-ignore
            return this.picker?.value || false
          }
        })
      }
    ]
  }

  // Editor initialization hook, here you can access the Editor
  onEditorInit () {

  }
}
