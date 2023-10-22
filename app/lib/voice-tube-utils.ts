import vm from "vm";

export function getYoutubeVideoId(url: string): string {
  const reg = /https:\/\/www.youtube.com\/watch\?v=(.*)/;

  const match = url.match(reg);

  if (!match) {
    throw new Error("No match");
  }

  return match[1];
}

export async function getVideoInfo(url: string): Promise<{
  url: string;
  title: string;
  subtitles: {
    en: string;
    cn: string;
    startTime: number;
    endTime: number;
    orderId: number;
  }[];
}> {
  const html = await fetch(url).then((res) => res.text());

  const reg = /<script>window\.__NUXT__=(.*?)<\/script>/m;
  const match = html.match(reg);

  if (!match) {
    throw new Error("No match");
  }

  const script = match[1];

  const sandbox = {};

  vm.createContext(sandbox);
  const data = vm.runInContext(script, sandbox);

  const subtitles = data.data[0].video.captionLines.map(
    (
      captionLine: {
        startAt: number;
        duration: number;
        originalText: { text: string };
        translatedText?: { text: string };
      },
      idx: number
    ) => ({
      startTime: captionLine.startAt,
      endTime: captionLine.startAt + captionLine.duration,
      en: captionLine.originalText.text,
      cn: captionLine.translatedText?.text || null,
      orderId: idx,
    })
  );

  return {
    url: data.data[0].video.youtubeUrl,
    title: data.data[0].video.title,
    subtitles,
  };
}
