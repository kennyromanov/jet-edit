<template>
  <slot v-if="tiptap" :tiptap="tiptap">
    <div :class="cn('editor flex flex-col gap-10', props.class)">
      <slot name="controls" :tiptap="tiptap">
        <div class="editor_controls">
          <div class="editor_control_group flex flex-wrap gap-6">
            <div class="editor_control flex gap-1" aria-label="Text formatting">
              <Button
                  size="sm"
                  :variant="tiptap.isActive('bold') ? 'default' : 'secondary'"
                  :disabled="!tiptap.can().chain().focus().toggleBold().run()"
                  @click="tiptap.chain().focus().toggleBold().run()"
              >
                <b>B</b>
              </Button>

              <Button
                  size="sm"
                  :variant="tiptap.isActive('italic') ? 'default' : 'secondary'"
                  :disabled="!tiptap.can().chain().focus().toggleItalic().run()"
                  @click="tiptap.chain().focus().toggleItalic().run()"
              >
                <i>I</i>
              </Button>

              <Button
                  size="sm"
                  :variant="tiptap.isActive('underline') ? 'default' : 'secondary'"
                  :disabled="!tiptap.can().chain().focus().toggleUnderline().run()"
                  @click="tiptap.chain().focus().toggleUnderline().run()"
              >
                <span class="underline">U</span>
              </Button>
            </div>

            <div class="editor_control flex gap-1" aria-label="Headings">
              <Button
                  size="sm"
                  :variant="tiptap.isActive('paragraph') ? 'default' : 'secondary'"
                  @click="tiptap.chain().focus().setParagraph().run()"
              >
                Text
              </Button>

              <Button
                  size="sm"
                  :variant="tiptap.isActive('heading', { level: 1 }) ? 'default' : 'secondary'"
                  @click="tiptap.chain().focus().toggleHeading({ level: 1 }).run()"
              >
                H1
              </Button>

              <Button
                  size="sm"
                  :variant="tiptap.isActive('heading', { level: 2 }) ? 'default' : 'secondary'"
                  @click="tiptap.chain().focus().toggleHeading({ level: 2 }).run()"
              >
                H2
              </Button>

              <Button
                  size="sm"
                  :variant="tiptap.isActive('heading', { level: 3 }) ? 'default' : 'secondary'"
                  @click="tiptap.chain().focus().toggleHeading({ level: 3 }).run()"
              >
                H3
              </Button>
            </div>

            <div class="editor_control flex gap-1" aria-label="Blocks">
              <Button
                  size="sm"
                  :variant="tiptap.isActive('bulletList') ? 'default' : 'secondary'"
                  @click="tiptap.chain().focus().toggleBulletList().run()"
              >
                Bullet
              </Button>

              <Button
                  size="sm"
                  :variant="tiptap.isActive('orderedList') ? 'default' : 'secondary'"
                  @click="tiptap.chain().focus().toggleOrderedList().run()"
              >
                List
              </Button>

              <Button
                  size="sm"
                  :variant="tiptap.isActive('codeBlock') ? 'default' : 'secondary'"
                  @click="tiptap.chain().focus().toggleCodeBlock().run()"
              >
                Code
              </Button>

              <Button
                  size="sm"
                  :variant="tiptap.isActive('blockquote') ? 'default' : 'secondary'"
                  @click="tiptap.chain().focus().toggleBlockquote().run()"
              >
                Quote
              </Button>
            </div>

            <div class="editor_control flex gap-1" aria-label="History">
              <Button
                  variant="secondary"
                  size="sm"
                  :disabled="!tiptap.can().chain().focus().undo().run()"
                  @click="tiptap.chain().focus().undo().run()"
              >
                Undo
              </Button>

              <Button
                  variant="secondary"
                  size="sm"
                  :disabled="!tiptap.can().chain().focus().redo().run()"
                  @click="tiptap.chain().focus().redo().run()"
              >
                Redo
              </Button>
            </div>
          </div>
        </div>
      </slot>

      <slot name="editor" :tiptap="tiptap">
        <EditorContent class="editor_inner" :editor="tiptap as any" />
      </slot>
    </div>
  </slot>

  <slot v-else name="noContent">
    No Content
  </slot>
</template>

<script setup lang="ts">

import { onMounted, onBeforeUnmount, ref, HTMLAttributes } from 'vue';
import { cn } from '@/shadcn/lib/utils';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';
import { Button } from '@/shadcn/components/ui/button';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';


// Defining the props

const props = defineProps<{
  class?: HTMLAttributes['class'] | null,
}>();


// Defining the variables

const tiptap = ref<Editor | null>(null);


// Defining the hooks

onMounted(() => {
  tiptap.value = new Editor({
    extensions: [
      Color.configure({ types: [ TextStyle.name, ListItem.name ] }),
      TextStyle.configure({ types: [ ListItem.name ] }),
      Underline,
      StarterKit,
    ],
    content: `
        <h2>
          Hi there,
        </h2>
        <p>
          this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text tiptap. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That’s a bullet list with one …
          </li>
          <li>
            … or two list items.
          </li>
        </ul>
        <p>
          Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
        </p>
        <pre><code class="language-css">body {
  display: none;
}</code></pre>
        <p>
          I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that’s amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `,
  });
});

onBeforeUnmount(() => {
  tiptap.value?.destroy();
});

</script>

<style>

.editor {
  .editor_inner {
    font-family: Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";
    line-height: 1.5;
    caret-color: var(--tiptap-black);
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;


    /* Text Styles */

    :first-child {
      margin-top: 0;
    }

    ul, ol {
      padding: 0 1rem;
      margin: 1.25rem 1rem 1.25rem 0.4rem;
      list-style-type: disc;
      list-style-position: outside;

      li p {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      }
    }

    h1, h2, h3, h4, h5, h6 {
      line-height: 1.1;
      margin-top: 2.5rem;
      text-wrap: pretty;
    }

    h1, h2 {
      margin-top: 3.5rem;
      margin-bottom: 1.5rem;
    }

    h1 {
      font-size: 1.4rem;
    }

    h2 {
      font-size: 1.2rem;
    }

    h3 {
      font-size: 1.1rem;
    }

    h4, h5, h6 {
      font-size: 1rem;
    }

    code {
      background-color: var(--tiptap-purple-light);
      border-radius: 0.4rem;
      color: var(--tiptap-black);
      font-size: 0.85rem;
      padding: 0.25em 0.3em;
    }

    pre {
      background: var(--tiptap-black);
      border-radius: 0.5rem;
      color: var(--tiptap-white);
      font-family: 'JetBrainsMono', monospace;
      margin: 1.5rem 0;
      padding: 0.75rem 1rem;

      code {
        background: none;
        color: inherit;
        font-size: 0.8rem;
        padding: 0;
      }
    }

    blockquote {
      border-left: 3px solid var(--tiptap-gray-3);
      margin: 1.5rem 0;
      padding-left: 1rem;
    }

    hr {
      border: none;
      border-top: 1px solid var(--tiptap-gray-2);
      margin: 2rem 0;
    }


    /* System Styles */

    .tiptap:focus {
      outline: none
    }

    ::-webkit-scrollbar {
      height: 14px;
      width: 14px
    }

    ::-webkit-scrollbar-track {
      background-clip: padding-box;
      background-color: transparent;
      border: 4px solid transparent;
      border-radius: 8px
    }

    ::-webkit-scrollbar-thumb {
      background-clip: padding-box;
      background-color: #0000;
      border: 4px solid rgba(0,0,0,0);
      border-radius: 8px
    }

    :hover::-webkit-scrollbar-thumb {
      background-color: #0000001a
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #00000026
    }

    ::-webkit-scrollbar-button {
      display: none;
      height: 0;
      width: 0
    }

    ::-webkit-scrollbar-corner {
      background-color: transparent
    }
  }
}

</style>