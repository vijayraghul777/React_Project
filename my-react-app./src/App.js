//import logo from './logo.svg';
import './App.css';
import { useSpring, animated } from 'react-spring';
import BottomSheet from './BottomSheet';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Bottom Sheet Example</h1>
      </header>
      <main>
        {/* Other components or content can go here */}
        <div className="content">
          <h2>Main Content</h2>
          <p>This is the main content of your application.</p>
        </div>
        <BottomSheet />
      </main>
    </div>
  );
}
export default App;
