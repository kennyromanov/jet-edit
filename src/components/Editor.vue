<script setup lang="ts">

import Editor from 'vue-edit';
import { Table, SquareCheckBig, FileImage, Dot, TextQuote, Link, AlignLeft, AlignCenter, AlignJustify, AlignRight } from 'lucide-vue-next';
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/shadcn/components/ui/menubar';

</script>

<template>
  <Editor>
    <template #controls="{ tiptap }">
      <Menubar class="w-min">
        <MenubarMenu>
          <MenubarTrigger>
            File
          </MenubarTrigger>

          <MenubarContent>
            <MenubarItem>
              New File
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>

            <MenubarItem>
              Save
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>

            <MenubarItem>
              Save As
              <MenubarShortcut>⇧⌘S</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarSub>
              <MenubarSubTrigger>
                Export
              </MenubarSubTrigger>

              <MenubarSubContent>
                <MenubarItem>
                  PDF
                </MenubarItem>

                <MenubarItem>
                  HTML
                </MenubarItem>

                <MenubarItem>
                  TXT
                </MenubarItem>

                <MenubarItem>
                  FLEXT
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>

            <MenubarSeparator />

            <MenubarItem>
              Print...
              <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>
            Edit
          </MenubarTrigger>

          <MenubarContent>
            <MenubarItem
                :disabled="!tiptap.can().chain().focus().undo().run()"
                @click="tiptap.chain().focus().undo().run()"
            >
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>

            <MenubarItem
                :disabled="!tiptap.can().chain().focus().redo().run()"
                @click="tiptap.chain().focus().redo().run()"
            >
              Redo
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarSub>
              <MenubarSubTrigger>
                Find
              </MenubarSubTrigger>

              <MenubarSubContent>
                <MenubarItem>
                  Find...
                </MenubarItem>

                <MenubarItem disabled>
                  Find Next
                </MenubarItem>

                <MenubarItem disabled>
                  Find Previous
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>

            <MenubarSeparator />

            <MenubarItem>
              Cut
            </MenubarItem>

            <MenubarItem>
              Copy
            </MenubarItem>

            <MenubarItem>
              Paste
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>
            Insert
          </MenubarTrigger>

          <MenubarContent>
            <MenubarItem>
              Table
              <MenubarShortcut><Table /></MenubarShortcut>
            </MenubarItem>

            <MenubarItem>
              Checkbox
              <MenubarShortcut><SquareCheckBig /></MenubarShortcut>
            </MenubarItem>

            <MenubarItem>
              Image
              <MenubarShortcut><FileImage /></MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarItem>
              Variable <MenubarShortcut>⇧⌘X</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>
            Format
          </MenubarTrigger>

          <MenubarContent>
            <MenubarItem
                :disabled="!tiptap.can().chain().focus().toggleBold().run()"
                @click="tiptap.chain().focus().toggleBold().run()"
                inset
            >
              Bold
              <MenubarShortcut>⌘B</MenubarShortcut>
            </MenubarItem>

            <MenubarItem
                :disabled="!tiptap.can().chain().focus().toggleItalic().run()"
                @click="tiptap.chain().focus().toggleItalic().run()"
                inset
            >
              Italic
              <MenubarShortcut>⌘I</MenubarShortcut>
            </MenubarItem>

            <MenubarItem
                :disabled="!tiptap.can().chain().focus().toggleUnderline().run()"
                @click="tiptap.chain().focus().toggleUnderline().run()"
                inset
            >
              Underline
              <MenubarShortcut>⇧⌘U</MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarCheckboxItem
                :model-value="tiptap.isActive('heading', { level: 1 })"
                @click="tiptap.chain().focus().toggleHeading({ level: 1 }).run()"
            >
              Title
              <MenubarShortcut>⌘⌥1</MenubarShortcut>
            </MenubarCheckboxItem>

            <MenubarCheckboxItem
                :model-value="tiptap.isActive('heading', { level: 2 })"
                @click="tiptap.chain().focus().toggleHeading({ level: 2 }).run()"
            >
              Heading
              <MenubarShortcut>⌘⌥2</MenubarShortcut>
            </MenubarCheckboxItem>

            <MenubarCheckboxItem
                :model-value="tiptap.isActive('heading', { level: 3 })"
                @click="tiptap.chain().focus().toggleHeading({ level: 3 }).run()"
            >
              Subheading
              <MenubarShortcut>⌘⌥3</MenubarShortcut>
            </MenubarCheckboxItem>

            <MenubarCheckboxItem
                :model-value="tiptap.isActive('paragraph')"
                @click="tiptap.chain().focus().setParagraph().run()"
            >
              Text
            </MenubarCheckboxItem>

            <MenubarCheckboxItem
                :disabled="!tiptap.can().chain().focus().toggleCodeBlock().run()"
                :model-value="tiptap.isActive('codeBlock')"
                @click="tiptap.chain().focus().toggleCodeBlock().run()"
            >
              Monospaced
            </MenubarCheckboxItem>

            <MenubarSeparator />

            <MenubarCheckboxItem
                :model-value="tiptap.isActive('bulletList')"
                @click="tiptap.chain().focus().toggleBulletList().run()"
            >
              Bullet
              <MenubarShortcut><Dot /></MenubarShortcut>
            </MenubarCheckboxItem>

            <MenubarCheckboxItem
                :model-value="tiptap.isActive('orderedList')"
                @click="tiptap.chain().focus().toggleOrderedList().run()"
            >
              List
              <MenubarShortcut>1.</MenubarShortcut>
            </MenubarCheckboxItem>

            <MenubarItem
                :disabled="!tiptap.can().chain().focus().toggleBlockquote().run()"
                @click="tiptap.chain().focus().toggleBlockquote().run()"
                inset
            >
              Quote
              <MenubarShortcut><TextQuote /></MenubarShortcut>
            </MenubarItem>

            <MenubarItem
                :disabled="!tiptap.can().chain().focus().toggleLink().run() || tiptap.isActive('link')"
                @click="tiptap.chain().focus().toggleLink().run()"
                inset
            >
              Link
              <MenubarShortcut><Link /></MenubarShortcut>
            </MenubarItem>

            <MenubarSeparator />

            <MenubarSub>
              <MenubarSubTrigger inset>
                Format
              </MenubarSubTrigger>

              <MenubarSubContent>
                <MenubarItem inset>
                  Format...
                </MenubarItem>

                <MenubarSeparator />

                <MenubarCheckboxItem model-value>
                  Left
                  <MenubarShortcut><AlignLeft /></MenubarShortcut>
                </MenubarCheckboxItem>

                <MenubarCheckboxItem>
                  Center
                  <MenubarShortcut><AlignCenter /></MenubarShortcut>
                </MenubarCheckboxItem>

                <MenubarCheckboxItem>
                  Justify
                  <MenubarShortcut><AlignJustify /></MenubarShortcut>
                </MenubarCheckboxItem>

                <MenubarCheckboxItem>
                  Right
                  <MenubarShortcut><AlignRight /></MenubarShortcut>
                </MenubarCheckboxItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </template>
  </Editor>
</template>

<style>

</style>