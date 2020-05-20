import React, {Component} from 'react';
import "shaka-player/dist/controls.css";
const shaka = require('shaka-player/dist/shaka-player.ui.js');
class VideoPlayer extends Component {

  player = null;

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

  onProgressUpdated(duration, totalBytes) {
    console.log('duration:' + duration + ' total: ' + totalBytes)
  }

  onBufferingEvent(type, buffering) {
    console.log('type: ' + type + ' buffering: ' + buffering);
  }

  onAbrStatusChangedEvent(type, newStatus) {
    console.log('type: ' + type + ' New Status: ' + newStatus)
  }

  onLoading() {
    console.log('Loading');
  }

  onTimelineRegionAddedEvent(detail) {
    console.log('detail - ' + detail);
  }

  componentDidMount() {
    //Link to MPEG-DASH video
    // Sources -- https://bitmovin.com/mpeg-dash-hls-examples-sample-streams/
    const manifestUri =
      //"https://bitmovin-a.akamaihd.net/content/playhouse-vr/mpds/105560.mpd"
      "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd";
    //'https://www.youtube.com/watch?v=UjtOGPJ0URM';
    //"https://bitmovin-a.akamaihd.net/content/playhouse-vr/video/1920_9000000/dash/init.mp4";

    //Getting reference to video and video container on DOM
    const video = this.videoComponent.current;
    const videoContainer = this.videoContainer.current;

    //Initialize shaka player
    this.player = new shaka.Player(video);
    
		let config = this.player.getConfiguration();
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
    const ui = new shaka.ui.Overlay(this.player, videoContainer, video);
    let controls = ui.getControls();
    console.log(controls);

    ui.configure(uiConfig); //configure UI
    
		// https://shaka-player-demo.appspot.com/docs/api/tutorial-config.html
		// https://shaka-player-demo.appspot.com/docs/api/shaka.extern.html#.PlayerConfiguration
		this.player.configure({
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
    this.player.addEventListener("error", this.onErrorEvent);

    this.player.addEventListener("streaming", this.onStreamingEvent);

    this.player.addEventListener('ProgressUpdated', this.onProgressUpdated);

    this.player.addEventListener('abrstatuschanged', this.onAbrStatusChangedEvent); 

    this.player.addEventListener('loading', this.onLoading);
    this.player.addEventListener('timelineregionadded', this.onTimelineRegionAddedEvent);

    let network = new shaka.net.NetworkingEngine();
    console.log('Network');
    console.log(network);

    // Try to load a manifest.
    // This is an asynchronous process.
    this.player
      .load(manifestUri, 30000)
      .then(() => {
        
        // This runs if the asynchronous load is successful.
        console.log("The video has now been loaded!");
        console.log(this.player);
        this.manifest = this.player.getManifest();
        console.log(this.manifest);

        console.log('Segment');
        let video = this.manifest.periods[0].variants[0].video
        let segment = video.getSegmentReference();
        console.log(segment);

        let reference = video.initSegmentReference;
        console.log(reference);

        let factory = this.player.getManifestParserFactory();
        console.log("Factory");
        console.log(factory);

        let stats = this.player.getStats();
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