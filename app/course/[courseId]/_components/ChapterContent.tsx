import { chapters } from "@prisma/client";
import YouTube from "react-youtube";
import MarkDown from "react-markdown";

interface ContentItem {
  Title: string;
  CodeExample: string;
  Explanation: string;
}

const ChapterContent = ({ chapter }: { chapter: chapters | undefined }) => {
  return (
    <div>
      <div className="m-5 flex justify-center items-center video-container">
        <div className="relative w-full max-w-4xl">
          <YouTube
            videoId={chapter?.videoId}
            opts={{
              playerVars: {
                autoplay: 0,
              },
            }}
            className="w-full h-auto"
          />
        </div>
      </div>
      <div>
        {chapter?.content &&
          Array.isArray(chapter.content) &&
          (chapter.content as unknown as ContentItem[]).map((item, index) => (
            <div
              key={index}
              className="border border-violet-400 rounded-lg mt-10 p-5 bg-violet-200 dark:bg-black"
            >
              <h2 className="text-xl font-semibold">{item?.Title}</h2>
              <p className="my-3 text-gray-600 dark:text-gray-400">
                <MarkDown>{item?.Explanation}</MarkDown>
              </p>
              {item?.CodeExample && (
                <pre className="my-3 p-3 rounded-md bg-black dark:bg-gray-300 text-white dark:text-black overflow-auto">
                  <code>{item?.CodeExample}</code>
                </pre>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChapterContent;
