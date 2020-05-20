import React, {Component} from 'react';
import "shaka-player/dist/controls.css";
const shaka = require('shaka-player/dist/shaka-player.ui.js');
class VideoPlayer extends Component {

  constructor(props) {
    super(props);

    //Creating reference to store video component on DOM
    this.videoComponent = React.createRef();

    //Creating reference to store video container on DOM
    this.videoContainer = React.createRef();

    //Initializing reference to error handlers
    this.onErrorEvent = this.onErrorEvent.bind(this);
    this.onError = this.onError.bind(this);
  }

  onErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    this.onError(event.detail);
  }

  onError(error) {
    // Log the error.
    console.error("Error code", error.code, "object", error);
  }

  onStreamingEvent(type) {
    console.log('StateChangedEvent ' + type)
  }

  onProgressUpdated(duration, totalBytes, bytesRemaining) {
    console.log('duration:' + duration + ' total: ' + totalBytes + ' remaining ' + bytesRemaining)
  }

  onBufferingEvent(type, buffering) {
    console.log('type: ' + type + ' buffering: ' + buffering);
  }

  onAbrStatusChangedEvent(type, newStatus) {
    console.log('type: ' + type + ' New Status: ' + newStatus)
  }

  componentDidMount() {
    //Link to MPEG-DASH video
    const manifestUri =
      "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd";
    //const manifestUri = 'https://www.youtube.com/watch?v=UjtOGPJ0URM';

    //Getting reference to video and video container on DOM
    const video = this.videoComponent.current;
    const videoContainer = this.videoContainer.current;

    //Initialize shaka player
    let player = new shaka.Player(video);
    
		let config = player.getConfiguration();
		console.log(config);

    //Setting UI configuration JSON object
    const uiConfig = {};

    //Configuring elements to be displayed on video player control panel
    uiConfig["controlPanelElements"] = [
      "rewind",
      "fast_forward",
      "mute",
      "volume",
      "time_and_duration",
			"overflow_menu",
    ];

    //Setting up shaka player UI
    const ui = new shaka.ui.Overlay(player, videoContainer, video);
    let controls = ui.getControls();
    console.log(controls);

    ui.configure(uiConfig); //configure UI
    
		// https://shaka-player-demo.appspot.com/docs/api/tutorial-config.html
		// https://shaka-player-demo.appspot.com/docs/api/shaka.extern.html#.PlayerConfiguration
		player.configure({
      preferredAudioLanguage: 'en-us',
      preferredTextLanguage: 'en-us',
      // streaming: {
      //   bufferingGoal: 300
      // },
    })
    
    shaka.polyfill.installAll();

    if (shaka.Player.isBrowserSupported()) {
      console.log('Browser supported')
    } else {
      console.log('Browser unsupported');
      return;
    }

    // Listen for error events.
    player.addEventListener("error", this.onErrorEvent);

    player.addEventListener("streaming", this.onStreamingEvent);

    player.addEventListener('ProgressUpdated', this.onProgressUpdated);

    player.addEventListener('abrstatuschanged', this.onAbrStatusChangedEvent); 

    let network = new shaka.net.NetworkingEngine(this.onProgressUpdated);
    console.log('Network');
    console.log(network);

    // Try to load a manifest.
    // This is an asynchronous process.
    player
      .load(manifestUri)
      .then(function () {
        
        // This runs if the asynchronous load is successful.
        console.log("The video has now been loaded!");
        let manifest = player.getManifest();
        console.log(manifest);

        let factory = player.getManifestParserFactory();
        console.log("Factory");
        console.log(factory);

        let stats = player.getStats();
        console.log("Stats");
        console.log(stats);

        //manifest.addEventListener('ProgressUpdated', this.onProgressUpdated);
        // http://v1-6-2.shaka-player-demo.appspot.com/docs/tutorial-player.html
        //console.log(player);
        //let segment = new shaka.media.InitSegmentReference();
        //console.log(segment);

      })
      .catch(this.onError); // onError is executed if the asynchronous load fails.
  }
  
  render() {
    /*
		Returning video with a container. Remember, when setting up shaka player with custom UI, you must
		add your video component inside a container
		The container will be used by shaka player to add your customized UI for the player
		*/
    return (
      <div className="video-container" ref={this.videoContainer}>
        <video
          //width='100%'
          className="shaka-video"
          ref={this.videoComponent}
          poster="//shaka-player-demo.appspot.com/assets/poster.jpg"
        />
      </div>
    );
  }
}

export default VideoPlayer;