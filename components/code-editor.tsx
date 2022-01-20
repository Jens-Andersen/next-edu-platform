import MonacoEditor, { OnMount } from '@monaco-editor/react'
import { useRef } from 'react'

interface CodeEditorProps {
  initialValue: string
  onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {

  const editorRef = useRef(null)

  const onEditorDidMount: OnMount = (editor, monaco) => {
    // console.log(editor.getValue())
    // @ts-ignore
    editorRef.current = editor
    // console.log(editorRef.current.getValue())

    editorRef.current.onDidChangeModelContent(() => {
      onChange(editorRef.current.getValue())
    })

    editor.getModel()?.updateOptions({ tabSize: 2 })

  }


  // const handleEditorChange = (value, onDidChangeModelContent(() => {
  //   console.log(editorRef.current.getValue())
  // })
  // )


  return <MonacoEditor
    onMount={onEditorDidMount}
    // find a way to use onChange prop instead of onMount. But onMount works for now
    // onChange={handleEditorChange}
    value={initialValue}
    theme="vs-dark"
    language="javascript"
    height="500px"
    options={{
      wordWrap: 'on',
      minimap: { enabled: false },
      showUnused: false,
      folding: false,
      lineNumbersMinChars: 3,
      fontSize: 16,
      scrollBeyondLastLine: false,
      automaticLayout: true
    }}
  />
}

export default CodeEditor
