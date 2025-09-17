<template>
  <div v-if="editor" class="container">
    <div class="control-group">
      <div class="button-group">
        <button
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold') }"
        >
          Bold
        </button>

        <button
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :class="{ 'is-active': editor.isActive('italic') }"
        >
          Italic
        </button>

        <button
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :class="{ 'is-active': editor.isActive('strike') }"
        >
          Strike
        </button>

        <button
            @click="editor.chain().focus().toggleCode().run()"
            :disabled="!editor.can().chain().focus().toggleCode().run()"
            :class="{ 'is-active': editor.isActive('code') }"
        >
          Code
        </button>

        <button @click="editor.chain().focus().unsetAllMarks().run()">Clear marks</button>

        <button @click="editor.chain().focus().clearNodes().run()">Clear nodes</button>

        <button
            @click="editor.chain().focus().setParagraph().run()"
            :class="{ 'is-active': editor.isActive('paragraph') }"
        >
          Paragraph
        </button>

        <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        >
          H1
        </button>

        <button
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          H2
        </button>

        <button
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        >
          H3
        </button>

        <button
            @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        >
          H4
        </button>

        <button
            @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        >
          H5
        </button>

        <button
            @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        >
          H6
        </button>

        <button
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          Bullet list
        </button>

        <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          Ordered list
        </button>

        <button
            @click="editor.chain().focus().toggleCodeBlock().run()"
            :class="{ 'is-active': editor.isActive('codeBlock') }"
        >
          Code block
        </button>

        <button
            @click="editor.chain().focus().toggleBlockquote().run()"
            :class="{ 'is-active': editor.isActive('blockquote') }"
        >
          Blockquote
        </button>

        <button @click="editor.chain().focus().setHorizontalRule().run()">Horizontal rule</button>

        <button @click="editor.chain().focus().setHardBreak().run()">Hard break</button>

        <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()">
          Undo
        </button>

        <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()">
          Redo
        </button>

        <button
            @click="editor.chain().focus().setColor('#958DF1').run()"
            :class="{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }"
        >
          Purple
        </button>
      </div>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">

import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';
import StarterKit from '@tiptap/starter-kit';

const editor = ref<Editor | null>(null);

// Instantiate the editor once the component is mounted.
onMounted(() => {
  editor.value = new Editor({
    extensions: [
      Color.configure({ types: [ TextStyle.name, ListItem.name ] }),
      TextStyle.configure({ types: [ ListItem.name ] }),
      StarterKit,
    ],
    content: `
        <h2>
          Hi there,
        </h2>
        <p>
          this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
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

// Dispose of the editor to prevent memory leaks.
onBeforeUnmount(() => {
  editor.value?.destroy();
});

</script>

<style>

/* Basic editor styles */
.tiptap :first-child {
  margin-top: 0;
}

/* List styles */
.tiptap ul,
.tiptap ol {
  padding: 0 1rem;
  margin: 1.25rem 1rem 1.25rem 0.4rem;
}

.tiptap ul li p,
.tiptap ol li p {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

/* Heading styles */
.tiptap h1,
.tiptap h2,
.tiptap h3,
.tiptap h4,
.tiptap h5,
.tiptap h6 {
  line-height: 1.1;
  margin-top: 2.5rem;
  text-wrap: pretty;
}

.tiptap h1,
.tiptap h2 {
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
}

.tiptap h1 {
  font-size: 1.4rem;
}

.tiptap h2 {
  font-size: 1.2rem;
}

.tiptap h3 {
  font-size: 1.1rem;
}

.tiptap h4,
.tiptap h5,
.tiptap h6 {
  font-size: 1rem;
}

/* Code and preformatted text styles */
.tiptap code {
  background-color: var(--tiptap-purple-light);
  border-radius: 0.4rem;
  color: var(--tiptap-black);
  font-size: 0.85rem;
  padding: 0.25em 0.3em;
}

.tiptap pre {
  background: var(--tiptap-black);
  border-radius: 0.5rem;
  color: var(--tiptap-white);
  font-family: 'JetBrainsMono', monospace;
  margin: 1.5rem 0;
  padding: 0.75rem 1rem;
}

.tiptap pre code {
  background: none;
  color: inherit;
  font-size: 0.8rem;
  padding: 0;
}

.tiptap blockquote {
  border-left: 3px solid var(--tiptap-gray-3);
  margin: 1.5rem 0;
  padding-left: 1rem;
}

.tiptap hr {
  border: none;
  border-top: 1px solid var(--tiptap-gray-2);
  margin: 2rem 0;
}

</style>