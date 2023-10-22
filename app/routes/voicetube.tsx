import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import z from "zod";
import { parse } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { Form, useActionData } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { getVideoInfo } from "~/lib/voice-tube-utils";
import { PrismaClient } from "@prisma/client";

const VoiceTubeUrlFormSchema = z.object({
  url: z.string().url(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema: VoiceTubeUrlFormSchema });

  if (!submission.value || submission.intent !== "submit") {
    return json({ status: "error", submission } as const);
  }

  const videoInfo = await getVideoInfo(submission.value.url);

  const prisma = new PrismaClient();
  const result = await prisma.videos.create({
    data: {
      title: videoInfo.title,
      originalUrl: videoInfo.url,
      subtitles: {
        create: videoInfo.subtitles.map((subtitle) => ({
          orderId: subtitle.orderId,
          en: subtitle.en,
          cn: subtitle.cn,
          startTime: subtitle.startTime,
          endTime: subtitle.endTime,
        })),
      },
    },
  });

  return redirect(`/video/${result.id}`);
}

export default function VoiceTube() {
  const actionData = useActionData<typeof action>();
  const [form, { url }] = useForm({
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, { schema: VoiceTubeUrlFormSchema });
    },
  });
  return (
    <div className="flex justify-center">
      <Form method="POST" className=" w-96" {...form.props}>
        <div className="space-y-2">
          <Label htmlFor="url">VoiceTube URL</Label>
          <div className="flex space-x-2">
            <Input
              name={url.name}
              defaultValue="https://tw.voicetube.com/videos/177360"
            />
            <Button className="w-24" type="submit">
              导入
            </Button>
          </div>
          <p className="text-sm font-medium text-destructive">{url.error}</p>
        </div>
      </Form>
    </div>
  );
}
