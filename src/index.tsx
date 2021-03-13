import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      // configuration object
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
    //console.log(service);
  };
  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    //console.log(input);
    // if that value is undefine or null just return early
    if (!ref.current) {
      return;
    }

    //console.log(ref.current);
    // Transpiring
    const result = await ref.current.transform(input, {
      loader: 'jsx',
      target: 'es2015'
    });

    //console.log(result);
    // update the code  piece of state that will cause our component to rerender
    setCode(result.code);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));