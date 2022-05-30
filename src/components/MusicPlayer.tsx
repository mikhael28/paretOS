import { useState, useMemo, useEffect, useRef } from "react";
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

export default function MusicPlayer(props: any) {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  interface Song {
    title: string;
    artist: string;
    img_src: any;
    src: string;
  }

  const songs: Song[] = useMemo(
    () => [
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
        title: "New York Yacht Club",
        artist: "Fats Waller",
        img_src: IoMdMusicalNote,
        src: FatsNY,
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
    <div
      style={{
        backgroundColor: "gray",
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingTop: 8,
      }}
    >
      <div>
        <h3>Now Playing</h3>
        <p>
          {songs[currentSong].title} by {songs[currentSong].artist}
        </p>
      </div>

      <div>
        <IoMdSkipBackward
          style={{ cursor: "pointer", margin: 12 }}
          onClick={handlePrevious}
        />
        {isPlaying ? (
          <IoMdPause
            style={{ cursor: "pointer", margin: 12 }}
            onClick={() => (!isPlaying ? handlePlay() : handlePause())}
          />
        ) : (
          <IoMdPlay
            style={{ cursor: "pointer", margin: 12 }}
            onClick={() => (!isPlaying ? handlePlay() : handlePause())}
          />
        )}
        <IoMdSkipForward
          style={{ cursor: "pointer", margin: 12 }}
          onClick={handleSkip}
        />
      </div>
    </div>
  );
}
