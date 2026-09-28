import { useEffect, useRef, useState } from "react";

function CryButton({ url, label = "Play cry" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(
    () => () => {
      audioRef.current?.pause();
    },
    [],
  );

  if (!url) return null;

  function toggle() {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }

  return (
    <button
      type="button"
      className="btn btn--ghost"
      aria-pressed={isPlaying}
      onClick={toggle}
    >
      <span className="btn__glyph" aria-hidden="true">
        {isPlaying ? "■" : "♪"}
      </span>
      {isPlaying ? "Stop" : label}
    </button>
  );
}

export default CryButton;
