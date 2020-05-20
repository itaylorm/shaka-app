import React from 'react';
import VideoPlayer from './VideoPlayer/VideoPlayer'
import './App.css';
//import Lesson from './lesson/lesson';
//import VideoReact from './VideoReact/VideoReact';

function App() {

  return (
    <div>
    <VideoPlayer url='https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd'/>
    </div>

    //<Lesson/>
    //<VideoReact/>
  );
}

export default App;
