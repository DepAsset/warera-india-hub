<template>

  <div class="editor-wrapper">

    <div class="toolbar">

        <button
            type="button"
            @click="editor.chain().focus().undo().run()"
        >
         ↶
        </button>

        <button
            type="button"
            @click="editor.chain().focus().redo().run()"
        >
         ↷
        </button>

        <button
        type="button"

        :class="{
            active:
            editor.isActive('paragraph')
        }"

        @click="
            editor.chain().focus().setParagraph().run()
        "
        >
        P
        </button>

        <button
        type="button"

        :class="{
            active:
            editor.isActive(
            'heading',
            { level:1 }
            )
        }"

        @click="
            editor.chain()
            .focus()
            .toggleHeading({
            level:1
            })
            .run()
        "
        >
        H1
        </button>

        <button
        type="button"

        :class="{
            active:
            editor.isActive(
            'heading',
            { level:2 }
            )
        }"

        @click="
            editor.chain()
            .focus()
            .toggleHeading({
            level:2
            })
            .run()
        "
        >
        H2
        </button>

        <button
        type="button"

        :class="{
            active:
            editor.isActive(
            'heading',
            { level:3 }
            )
        }"

        @click="
            editor.chain()
            .focus()
            .toggleHeading({
            level:3
            })
            .run()
        "
        >
        H3
        </button>

        <button
        type="button"

        :class="{
            active:
            editor.isActive('bold')
        }"

        @click="
            editor.chain()
            .focus()
            .toggleBold()
            .run()
        "
        >
        B
        </button>
        <button
        type="button"

        :class="{
            active:
            editor.isActive('italic')
        }"

        @click="
            editor.chain()
            .focus()
            .toggleItalic()
            .run()
        "
        >
        I
        </button>

        <button
        type="button"

        :class="{
            active:
            editor.isActive('underline')
        }"

        @click="
            editor.chain()
            .focus()
            .toggleUnderline()
            .run()
        "
        >
        U
        </button>
        <button
        type="button"

        :class="{
            active:
            editor.isActive('highlight')
        }"

        @click="
            editor.chain().focus().toggleHighlight().run()
        "
        >
        Mark
        </button>

        <button
        type="button"
        @click="setLink"
        >
        🔗
        </button>

        <button
        type="button"
        @click="addImage"
        >
        🖼
        </button>

        <button
        type="button"

        :class="{
            active:
            editor.isActive('bulletlist')
        }"

        @click="
            editor.chain().focus().toggleBulletList().run()
        "
        >
        • List
        </button>

        <button
        type="button"

        :class="{
            active:
            editor.isActive('orderedlist')
        }"

        @click="
            editor.chain().focus().toggleOrderedList().run()
        "
        >
        1. List
        </button>

        <button
        type="button"

        :class="{
            active:
            editor.isActive('blockquote')
        }"

        @click="
            editor.chain().focus().toggleBlockquote().run()
        "
        >
        Quote
        </button>

        <button
        type="button"

        :class="{
            active:
            editor.isActive('horzrule')
        }"

        @click="
            editor.chain().focus().setHorizontalRule().run()
        "
        >
        —
        </button>

        <button
        type="button"
        @click="testUpload"
        >
        TEST UPLOAD
        </button>

    </div>

    <EditorContent
      :editor="editor"
      class="editor"
    />

  </div>

</template>

<script setup>

import { onBeforeUnmount } from "vue"

import { Editor, EditorContent }
from "@tiptap/vue-3"

import StarterKit
from "@tiptap/starter-kit"

import Underline
from "@tiptap/extension-underline"

import Placeholder
from "@tiptap/extension-placeholder"

import Link
from "@tiptap/extension-link"

import Image
from "@tiptap/extension-image"

import TextAlign
from "@tiptap/extension-text-align"

import Highlight
from "@tiptap/extension-highlight"

import HorizontalRule
from "@tiptap/extension-horizontal-rule"

import { API_URL }
from "../api"

const props =
  defineProps({
    modelValue: {
      type: String,
      default: ""
    }
  })

const emit =
  defineEmits([
    "update:modelValue"
  ])

const editor = new Editor({

  extensions: [

    StarterKit,

    Underline,

    Highlight,

    Link.configure({
        openOnClick: false
    }),

    Image,

    HorizontalRule,

    TextAlign.configure({
        types: [
        "heading",
        "paragraph"
        ]
    }),

    Placeholder.configure({

        placeholder:
        "Start writing your guide..."

    })

    ],
  content: props.modelValue,

  onUpdate({ editor }) {

    emit(
      "update:modelValue",
      editor.getHTML()
    )

  }

})

async function testUpload() {

  const input =
    document.createElement("input")

  input.type = "file"

  input.accept = "image/*"

  input.click()

  input.onchange = async () => {

    const file =
      input.files[0]

    const formData =
      new FormData()

    formData.append(
      "image",
      file
    )

    const response =
      await fetch(
        `${API_URL}/api/upload/guide-image`,
        {
          method: "POST",
          body: formData
        }
      )

    const data =
      await response.json()

    editor
        .chain()
        .focus()
        .setImage({
            src: `${API_URL}${data.url}`
        })
        .run()

  }

}

function addImage() {

  const url = prompt(
    "Enter image URL"
  )

  if (!url)
    return

  editor
    .chain()
    .focus()
    .setImage({
      src: url
    })
    .run()

}

function setLink() {

  const url = prompt(
    "Enter URL"
  )

  if (!url)
    return

  editor
    .chain()
    .focus()
    .setLink({
      href: url
    })
    .run()

}

onBeforeUnmount(() => {

  editor.destroy()

})

</script>

<style scoped>

.editor-wrapper{

  border:1px solid rgba(255,255,255,.1);

  border-radius:16px;

  overflow:visible;

}

.toolbar{

  position:sticky;

  top:70px;

  z-index:999;

  display:flex;

  flex-wrap:wrap;

  gap:10px;

  padding:16px;

  background:
  rgba(8,20,45,.98);

  backdrop-filter:
  blur(12px);

  border-bottom:
  1px solid rgba(255,255,255,.08);

}

.toolbar button{

  background:
  rgba(255,255,255,.08);

  border:none;

  color:white;

  padding:8px 12px;

  border-radius:8px;

  cursor:pointer;

}

.editor{

  min-height:400px;

  padding:20px;

  color:white;

}

:deep(.ProseMirror){

  min-height:350px;

  outline:none;

}
.toolbar button.active{

  background:#ff9933;

  color:black;

  font-weight:700;

  box-shadow:
    0 0 20px rgba(255,153,51,.45);

}

</style>