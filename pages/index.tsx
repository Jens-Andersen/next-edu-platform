import type { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react'
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin'
import { fetchPlugin } from '../plugins/fetch-plugin'
import CodeEditor from '../components/code-editor'

const Home: NextPage = () => {
  const iframe = useRef<any>()
  // Input the user writes in the code editor
  const [inputCode, setInputCode] = useState('')

  const startEsbuild = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm'
    })
  }

  useEffect(() => {
    console.log('-- Called "startEsbuild" --')
    startEsbuild()
  }, [])

  const onClick = async () => {
    if (!startEsbuild) {
      console.warn('Esbuild is not initialized')
      return
    }

    iframe.current.srcdoc = html

    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(),
      fetchPlugin(inputCode)
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      }
    })

    // setOutputCode(result.outputFiles[0].text)

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*')
  }

  const html = `
    <hmtl>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (error) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>'
              console.error(error);
            }
          }, false);
        </script>
      </body>
    </html>
  `

  return (
    <>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInputCode(value)}
      />
      <textarea value={inputCode} onChange={e => setInputCode(e.target.value)}>

      </textarea>
      <button onClick={onClick}>
        submit
      </button>
      <iframe title='preview' ref={iframe} sandbox='allow-scripts' srcDoc={html} />
    </>
  )
}


export default Home
