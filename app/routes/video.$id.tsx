import { PrismaClient } from "@prisma/client";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import YouTubePlayer from "~/components/youtube-player";
import { getYoutubeVideoId } from "~/lib/voice-tube-utils";
import Subtitles from "~/components/subtitles";
import { useCallback, useRef, useState } from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  const prisma = new PrismaClient();
  const video = await prisma.videos.findUnique({
    select: {
      subtitles: {
        select: { en: true, cn: true, startTime: true, endTime: true },
      },
      title: true,
      originalUrl: true,
    },
    where: { id: params.id },
  });
  return json(video);
}

export default function Video() {
  const data = useLoaderData<typeof loader>();
  const [currentTime, setCurrentTime] = useState(0);
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);
  const handlePlayerReady = useCallback((player: YT.Player) => {
    playerRef.current = player;
  }, []);
  const handleSubtitlesChangeTime = useCallback((time: number) => {
    playerRef.current?.seekTo(time, true);
  }, []);
  const playerRef = useRef<YT.Player>();

  if (!data) {
    return null;
  }

  return (
    <div className="min-w-[400px] max-w-[1024px]">
      <YouTubePlayer
        videoId={getYoutubeVideoId(data!.originalUrl)}
        onTimeUpdate={handleTimeUpdate}
        className="aspect-video"
        onPlayerReady={handlePlayerReady}
      />
      <div className="m-4">
        <Subtitles
          currentTime={currentTime}
          subtitles={data.subtitles}
          className="h-[360px]"
          onChangeTime={handleSubtitlesChangeTime}
        />
      </div>
    </div>
  );
}
