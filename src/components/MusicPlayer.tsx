import { useState, useMemo, MouseEventHandler } from "react";
import {
  IoMdPlay,
  IoMdPause,
  IoMdSkipForward,
  IoMdSkipBackward,
  IoMdMusicalNote,
  IoMdMusicalNotes,
} from "react-icons/io";
import { AudioPlaylist } from "ts-audio";
import FatsNY from "../assets/mp3/FatsNY.mp3";
import PictureBall from "../assets/mp3/PictureBall.mp3";
import Silvery from "../assets/mp3/Silvery.mp3";
import SecretGarden from "../assets/mp3/SecretGarden.mp3";
import { IconType } from "react-icons/lib";

export interface Song {
  title: string;
  artist: string;
  img_src: IconType;
  src: string;
}

export default function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const songs: Song[] = useMemo(
    () => [
      {
        title: "New York Yacht Club",
        artist: "Fats Waller",
        img_src: IoMdMusicalNote,
        src: FatsNY,
      },
      {
        title: "By the Lights of the Silvery",
        artist: "Fats Waller",
        img_src: IoMdMusicalNotes,
        src: Silvery,
      },
      {
        title: "At the Moving Picture Ball",
        artist: "Maurice Burkhart",
        img_src: IoMdMusicalNote,
        src: PictureBall,
      },
      {
        title: "Secret Garden",
        artist: "Unknown",
        img_src: IoMdMusicalNote,
        src: SecretGarden,
      },
    ],
    []
  );

  const playlist = useMemo(() => {
    return AudioPlaylist({
      files: songs.map((song: Song) => song.src),
      loop: false,
    });
  }, [songs]);

  playlist.on("start", (param) => {
    // doesn't seem to have any data in the param
    console.log(param);
  });

  playlist.on("end", (param) => {
    // doesn't seem to work
  });

  const handlePlay = () => {
    playlist.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    playlist.pause();
    setIsPlaying(false);
  };

  const handleSkip = () => {
    playlist.pause();
    playlist.next();
    setIsPlaying(true);

    setCurrentSong(
      (currentSong) => (currentSong + 1 + songs.length) % songs.length
    );
  };

  const handlePrevious = () => {
    playlist.pause();
    playlist.prev();
    setIsPlaying(true);
    setCurrentSong(
      (currentSong) => (currentSong - 1 + songs.length) % songs.length
    );
  };

  return (
    <div className="sticky-audio">
      <div
        style={{
          backgroundColor: "gray",
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: 20,
          paddingTop: 8,
        }}
      >
        <NowPlaying songs={songs} currentSong={currentSong} />
        <MusicPlayerControls
          isPlaying={isPlaying}
          handlePrevious={handlePrevious}
          handlePlay={handlePlay}
          handlePause={handlePause}
          handleSkip={handleSkip}
        />
      </div>
    </div>
  );
}

interface NowPlayingProps {
  songs: Song[];
  currentSong: number;
}

function NowPlaying({ songs, currentSong }: NowPlayingProps) {
  return (
    <div>
      <h3>Now Playing</h3>
      <p>
        {songs[currentSong].title} by {songs[currentSong].artist}
      </p>
    </div>
  )
}

interface MusicPlayerPlayerControlsProps {
  isPlaying: boolean;
  handlePrevious: MouseEventHandler;
  handlePlay: MouseEventHandler;
  handlePause: MouseEventHandler;
  handleSkip: MouseEventHandler;
}

function MusicPlayerControls({ isPlaying, handlePrevious, handlePlay, handlePause, handleSkip }: MusicPlayerPlayerControlsProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
      <StyledIcon Icon={IoMdSkipBackward} handleClick={handlePrevious}/>
      {isPlaying ? (
        <StyledIcon Icon={IoMdPause} handleClick={(e) => (!isPlaying ? handlePlay(e) : handlePause(e))}/>
      ) : (
        <StyledIcon Icon={IoMdPlay} handleClick={(e) => (!isPlaying ? handlePlay(e) : handlePause(e))}/>
      )}
      <StyledIcon Icon={IoMdSkipForward} handleClick={handleSkip}/>
    </div>
  )
}

function StyledIcon({ Icon, handleClick }: { Icon: IconType, handleClick: MouseEventHandler }) {
  return (
    <div style={{ cursor: "pointer", margin: 12 }}>
      <Icon onClick={handleClick} />
    </div>
  )
}