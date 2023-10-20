import { useEffect, useRef, useState } from "react";

type YouTubePlayerProps = {
  videoId: string;
  className?: string;
  onTimeUpdate?: (time: number) => void;
};

function useYoutubeEnv() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!document.getElementById("www-widgetapi-script")) {
      const scriptTag = document.createElement("script");
      scriptTag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(scriptTag);
      (window as any).onYouTubeIframeAPIReady = () => {
        delete (window as any).onYouTubeIframeAPIReady;
        setInitialized(true);
      };

      return () => {
        document.head.removeChild(scriptTag);
        delete (window as any).onYouTubeIframeAPIReady;
      };
    } else {
      const fn = (window as any).onYouTubeIframeAPIReady;
      if (fn) {
        (window as any).onYouTubeIframeAPIReady = () => {
          fn();
          setInitialized(true);
        };
      } else {
        setInitialized(true);
      }
    }
  }, []);

  return initialized;
}
export default function YouTubePlayer({
  videoId,
  className,
  onTimeUpdate,
}: YouTubePlayerProps) {
  const playerAnchor = useRef<HTMLDivElement>(null);
  const initialized = useYoutubeEnv();
  useEffect(() => {
    if (!initialized) {
      return;
    }

    const playerAnchorElement = playerAnchor.current;
    const playerElement = document.createElement("div");
    playerAnchorElement?.appendChild(playerElement);
    const player = new YT.Player(playerElement, {
      height: "100%",
      width: "100%",
      videoId: videoId,
      host: "https://www.youtube.com",
    });

    let handle = 0;
    player.addEventListener(
      "onStateChange",
      (e: YT.PlayerEvent & { data: YT.PlayerState }) => {
        if (e.data === YT.PlayerState.PLAYING) {
          handle = setInterval(() => {
            onTimeUpdate?.(player.getCurrentTime());
          }, 50) as unknown as number;
        } else {
          clearInterval(handle);
        }
      }
    );
    return () => {
      player.destroy();
      // remove all children
      while (playerAnchorElement?.firstChild) {
        playerAnchorElement.removeChild(playerAnchorElement.firstChild);
      }
      clearInterval(handle);
    };
  }, [initialized, videoId, onTimeUpdate]);
  return <div ref={playerAnchor} className={className}></div>;
}
