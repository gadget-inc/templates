import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useEffect, useState } from "react";

type PostProps = {
  title: string;
  content: {
    html: string;
  } | null;
  updatedAt: Date;
  author: string | null;
};

export default ({ title, content, updatedAt, author }: PostProps) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    setFormattedDate(updatedAt.toDateString());
  }, [updatedAt]);

  return (
    <Card className="min-w-full max-w-4xl shadow-md">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {formattedDate ? `Updated: ${formattedDate}` : "Updated: ..."}
          </CardDescription>
        </div>
        <div className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
          {author ? `By: ${author}` : "Anonymous"}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div
          className="max-h-[400px] overflow-y-auto prose dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: content?.html || "",
          }}
        />
      </CardContent>
    </Card>
  );
};
