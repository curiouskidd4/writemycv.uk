import React, { useEffect } from "react";
import ReactDOM from "react-dom";
// import {
//   Editor,
//   EditorState,
//   RichUtils,
//   convertFromRaw,
//   convertToRaw,
// } from "draft-js";
// import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";
// import "draft-js/dist/Draft.css";
import { createReactEditorJS } from "react-editor-js";
// import EditorJS from "@editorjs/editorjs";

// import Embed from '@editorjs/embed'
// import Table from '@editorjs/table'
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
// import Warning from '@editorjs/warning'
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
// import Image from '@editorjs/image'
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
// import CheckList from '@editorjs/checklist'
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
// import SimpleImage from '@editorjs/simple-image'
// import StarterKit from '@tiptap/starter-kit'

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import {
  EditorContent,
  EditorProvider,
  useCurrentEditor,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import "./editor.css";
import { Button, Space } from "antd";
// define your extension array
// const extensions = [
//   StarterKit,
// ]

const content = "<p>Hello World!</p>";

const MenuBar = ({ editor }) => {
  // const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <Space
      direction="horizontal"
      style={{
        paddingBottom: "0.25rem",
        marginBottom: "0.25rem",
        borderBottom: "1px solid #d9d9d9",
        width: "100%",
      }}
    >
      <Button
        size="small"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
        type={editor.isActive("bold") ? "primary" : undefined}
      >
        bold
      </Button>
      <Button
        size="small"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
        type={editor.isActive("italic") ? "primary" : undefined}
      >
        italic
      </Button>
      {/* <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
      >
        h6
      </button> */}
      {/* <Button
        size="small"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
        type={editor.isActive("bulletList") ? "primary" : undefined}
      >
        bullet list
      </Button> */}
      {/* <Button
        size="small"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
        type={editor.isActive("orderedList") ? "primary" : undefined}
      >
        ordered list
      </Button> */}
      {/* <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        redo
      </button>
      <button
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
      >
        purple
      </button> */}
    </Space>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

const Tiptap = ({ content, onChange }) => {
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      if (!editor) return;
      // console.log(editor.getHTML());
      onChange(editor.getHTML());
    },
  
    slotBefore: <MenuBar />,
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content]);



  return (
    // <EditorProvider
    // editorProps={{
    //   attributes: {
    //     class: "editor",
    //   },
    // }}
    //   slotBefore={<MenuBar />}
    //   extensions={extensions}
    //   content={content}
    //   onUpdate={({ editor }) => {
    //     // console.log(editor.getHTML());
    //     onChange(editor.getHTML());
    //   }}
    // >
    //   {/* <FloatingMenu>This is the floating menu</FloatingMenu>
    //   <BubbleMenu>This is the bubble menu</BubbleMenu> */}
    // </EditorProvider>
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export const EDITOR_JS_TOOLS = {
  // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
  // paragraph: Paragraph,
  // embed: Embed,
  // table: Table,
  list: List,
  // warning: Warning,
  code: Code,
  linkTool: LinkTool,
  // image: Image,
  raw: Raw,
  header: Header,
  quote: Quote,
  marker: Marker,
  // checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  // simpleImage: SimpleImage,
};

const EditorJsInput = ({ value, onChange }) => {
  //   const [editorState, setEditorState] = React.useState(() =>
  //     EditorState.createEmpty()
  //   );

  const ReactEditorJS = createReactEditorJS();

  useEffect(() => {
    // let rawData = markdownToDraft(value);
    // let contentState = convertFromRaw(rawData);
    // setEditorState(EditorState.createWithContent(contentState));
  }, []);

  const handleChange = (value) => {
    // let savedRes = value.saver.save().then((outputData) => {
    //   onChange(outputData);
    // });
    onChange(value);
  };

  return (
    <div
      style={{
        border: "1px solid #d9d9d9",
        padding: "0.25rem 0.75rem",
        borderRadius: "0.5rem",
        maxHeight: "300px",
        minHeight: "200px",
        overflowY: "auto",
      }}
      className="editor-container"
    >
      {/* <ReactEditorJS
        holder="custom"
        defaultValue={value}
        // factory={{ "onChange": handleChange }}
        onChange={handleChange}
        placeholder="Enter your content here..."
        tools={EDITOR_JS_TOOLS}
      >
        <div id="custom" />
      </ReactEditorJS> */}

      <Tiptap content={value} onChange={onChange} />
    </div>
  );
};

export default EditorJsInput;
