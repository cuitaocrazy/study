import type { ActionFunctionArgs } from "@remix-run/node";
import z from "zod";
import { parse } from "@conform-to/zod";
import { Form } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

const VoiceTubeUrlFormSchema = z.object({
  url: z.string().url(),
});

export async function action({ request }: ActionFunctionArgs) {
  console.log(request);
  const formData = await request.formData();
  const obj = Object.fromEntries(formData.entries());
  console.log(Array.from(formData.entries()));
  console.log(formData.get("url"));
  console.log(VoiceTubeUrlFormSchema.parse(obj));
  console.log(parse(formData, { schema: VoiceTubeUrlFormSchema }));
  return null;
}

export default function VoiceTube() {
  return (
    <Form method="POST">
      <Label htmlFor="url">VoiceTube URL</Label>
      <Input id="url" name="url" type="url" />
      <Input name="url" type="url" />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
