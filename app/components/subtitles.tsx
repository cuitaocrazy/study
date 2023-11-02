import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export type SubtitlesProps = {
  currentTime: number;
  className?: string;
  onChangeTime?: (time: number) => void;
  subtitles: {
    startTime: number;
    endTime: number;
    en: string;
    cn: string | null;
  }[];
};

function getEnWordPopvers(en: string) {
  const words = en.split(" ");

  return words.map((word, idx) => {
    return (
      <div key={idx} className=" inline">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="link"
              key={idx}
              className="p-0"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {word + " "}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">{word}</PopoverContent>
        </Popover>
      </div>
    );
  });
}

export default function Subtitles({
  currentTime,
  subtitles,
  className,
  onChangeTime,
}: SubtitlesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollDivRef = useRef<HTMLDivElement>();

  const currentIndex = subtitles.findIndex(
    (subtitle, idx) =>
      currentTime >= subtitle.startTime &&
      (subtitles[idx + 1] === undefined ||
        currentTime <= subtitles[idx + 1].startTime)
  );

  useEffect(() => {
    if (ref.current) {
      const scrollDiv = ref.current.querySelector("div");

      if (!scrollDiv) {
        return;
      }

      scrollDivRef.current = scrollDiv;
    }
  }, []);

  useEffect(() => {
    if (scrollDivRef.current && currentIndex > -1) {
      const scrollDiv = scrollDivRef.current;
      const offsetTop =
        (scrollDiv.children[0] as HTMLElement).offsetTop +
        (scrollDiv.children[0].children[0] as HTMLElement).offsetTop;

      const subtitleElements = scrollDiv.children[0].children[0].children;
      const middle = scrollDiv.clientHeight / 2;
      const currentSubtitleElement = subtitleElements[
        currentIndex
      ] as HTMLElement;
      const currentMiddle = currentSubtitleElement.clientHeight / 2;

      if (
        offsetTop + currentSubtitleElement.offsetTop + currentMiddle >
        middle
      ) {
        scrollDiv.scrollTop =
          currentSubtitleElement.offsetTop + currentMiddle - middle;
      }
    }
  }, [currentIndex]);

  return (
    <ScrollArea className={className} ref={ref}>
      <ul className="space-y-2">
        {subtitles.map((subtitle, idx) => (
          <li
            key={subtitle.startTime}
            className={idx === currentIndex ? "font-bold" : ""}
            onClick={() => onChangeTime?.(subtitle.startTime)}
          >
            <div className="space-x-1">{...getEnWordPopvers(subtitle.en)}</div>
            <div className="text-sm text-muted-foreground">{subtitle.cn}</div>
            <Separator />
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
