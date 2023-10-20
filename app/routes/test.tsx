// import { ClientOnly } from "~/components/client-only";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import YouTubePlayer from "~/components/youtube-player";
import fs from "fs";
import srtParser2 from "srt-parser-2";
import { useRef } from "react";

export const loader = async () => {
  const srt = fs.readFileSync("./public/example.srt", "utf8");
  const parser = new srtParser2();
  const srt_array = parser.fromSrt(srt);
  return json(srt_array);
};

export default function Home() {
  const data = useLoaderData<typeof loader>();
  const currentIndex = useRef(-1);
  const handleTimeUpdate = (time: number) => {
    data.forEach((item) => {
      if (
        item.startSeconds <= time + 0.05 &&
        item.endSeconds >= time + 0.05 &&
        currentIndex.current.toString() !== item.id
      ) {
        console.log(item.text);
        currentIndex.current = parseInt(item.id);
      }
    });
  };
  return (
    <>
      <YouTubePlayer
        videoId="W58no8qD8ws"
        className="w-96 h-48"
        onTimeUpdate={handleTimeUpdate}
      />
    </>
  );
}
