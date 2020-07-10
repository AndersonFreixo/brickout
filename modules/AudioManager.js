/*The switcher object is used to overcome the fact that the same audio file
cannot be played again until the current execution is done. So, for each
audio file, a switcher with "channelsNum" instances of the same audio file is created
and each time this audio is requested, the current available "channel" is played
and the internal counter "index" is incremented. Making the audio ready to be
played again.
This idea was extracted from a Tim Cotton's article:
https://blog.cotten.io/playing-audio-resources-simultaneously-in-javascript-546ec4d6216a
(My implementation is slightly different though.)*/


class AudioManager{
  constructor(){

    this.switchers = [];

  }

  loadToSwitcher(name, src, cn){
    this.switchers[name] = this.createSwitcher(src, cn);
  }

  createSwitcher(src, cn){
    let channels = [];
    for (let i = 0; i < cn; i++){
        let sound = new Audio(src);
        channels.push(sound);
    }
    return {channels: channels, index: 0, channelsNumber: cn};
  }
  playSound(name){
    let switcher = this.switchers[name];
    switcher.channels[switcher.index].play();
    console.log("Playing channel " + switcher.index);
    if (switcher.index +1< switcher.channelsNumber){
      switcher.index++;
    }
    else switcher.index = 0;
  }
}
