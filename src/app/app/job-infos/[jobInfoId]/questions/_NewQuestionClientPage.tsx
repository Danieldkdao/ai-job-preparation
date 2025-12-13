"use client";

import BackLink from "@/components/BackLink";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  questionDifficulties,
  type JobInfoTable,
  type QuestionDifficulty,
} from "@/drizzle/schema";
import { formatQuestionDifficulty } from "@/features/questions/formatters";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useChat } from "@ai-sdk/react";
import { errorToast } from "@/lib/errorToast";
import { DefaultChatTransport, UIMessage } from "ai";

type QuestionResponseUIMessage = UIMessage<
  never,
  {
    questionId: string;
  }
>;

type Status = "awaiting-answer" | "awaiting-difficulty" | "init";

export const NewQuestionClientPage = ({
  jobInfo,
}: {
  jobInfo: Pick<typeof JobInfoTable.$inferSelect, "id" | "name" | "title">;
}) => {
  const [status, setStatus] = useState<Status>("init");
  const [answer, setAnswer] = useState<string | null>("");
  const [questionId, setQuestionId] = useState<string | null>(null);

  const {
    messages: questions,
    setMessages: setQuestion,
    sendMessage: generateQuestion,
    status: ResponseProgress,
  } = useChat<QuestionResponseUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/ai/questions/generate-question",
    }),
    onData: (dataPart) => {
      setQuestionId(dataPart.data);
    },
    onFinish: () => {
      setStatus("awaiting-answer");
    },
    onError: (error) => {
      errorToast(error.message);
    },
  });

  const isGeneratingQuestion =
    ResponseProgress === "submitted" || ResponseProgress === "streaming";
  const lastQuestion = questions
    .filter((msg) => msg.role === "assistant")
    .slice(-1)[0];

  const question = lastQuestion?.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  const {
    messages: feedbacks,
    setMessages: setFeedback,
    sendMessage: generateFeedback,
    status: FeedbackProgress,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/questions/generate-feedback",
    }),
    onFinish: () => {
      setStatus("awaiting-difficulty");
    },
    onError: (error) => {
      errorToast(error.message);
    },
  });

  const isGeneratingFeedback =
    FeedbackProgress === "submitted" || FeedbackProgress === "streaming";
  const lastFeedback = feedbacks
    .filter((msg) => msg.role === "assistant")
    .slice(-1)[0];

  const feedback = lastFeedback?.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  return (
    <div className="flex flex-col items-center gap-4 max-w-[2000px] mx-auto grow h-screen-header">
      <div className="container flex gap-4 mt-4 items-center justify-between">
        <div className="grow basis-0">
          <BackLink href={`/app/job-infos/${jobInfo.id}`}>
            {jobInfo.name}
          </BackLink>
        </div>
        <Controls
          reset={() => {
            setStatus("awaiting-difficulty");
            setQuestion([]);
            setFeedback([]);
            setAnswer(null);
          }}
          disableAnswerButton={
            answer == null ||
            answer.trim() === "" ||
            questionId == null ||
            isGeneratingFeedback
          }
          status={status}
          isLoading={isGeneratingFeedback || isGeneratingQuestion}
          generateFeedback={() => {
            if (answer == null || answer.trim() === "") return;
            generateFeedback({ text: answer.trim() }, { body: { questionId } });
          }}
          generateQuestion={(difficulty) => {
            setQuestion([]);
            setFeedback([]);
            setAnswer(null);
            generateQuestion(
              { text: difficulty },
              { body: { jobInfoId: jobInfo.id } }
            );
          }}
        />
        <div className="grow hidden md:block" />
      </div>
      <QuestionContainer
        status={status}
        question={question}
        answer={answer}
        setAnswer={setAnswer}
        feedback={feedback}
      />
    </div>
  );
};

const QuestionContainer = ({
  question,
  feedback,
  answer,
  status,
  setAnswer,
}: {
  question: string | null;
  feedback: string | null;
  answer: string | null;
  status: Status;
  setAnswer: Dispatch<SetStateAction<string | null>>;
}) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="grow border-t">
      <ResizablePanel id="question-and-feedback" defaultSize={50} minSize={5}>
        <ResizablePanelGroup direction="vertical" className="grow border-t">
          <ResizablePanel id="question" defaultSize={25} minSize={5}>
            <ScrollArea className="h-full min-w-48 *:h-full">
              {status === "init" && question == null ? (
                <p className="text-base md:text-lg text-center flex items-center justify-center h-full p-6">
                  Get started by selected a question difficulty above.
                </p>
              ) : (
                question && (
                  <MarkdownRenderer className="p-6">
                    {question}
                  </MarkdownRenderer>
                )
              )}
            </ScrollArea>
          </ResizablePanel>

          {feedback && (
            <>
              <ResizableHandle />
              <ResizablePanel id="feedback" defaultSize={75} minSize={5}>
                <ScrollArea className="h-full min-w-48 *:h-full">
                  <MarkdownRenderer className="p-6">
                    {feedback}
                  </MarkdownRenderer>
                </ScrollArea>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="answer" defaultSize={50} minSize={5}>
        <ScrollArea className="h-full min-w-48 *:h-full">
          <Textarea
            value={answer ?? ""}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-full resize-none border-none rounded-none focus-visible:ring focus-visible:ring-inset text-base p-6"
          />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

const Controls = ({
  disableAnswerButton,
  status,
  isLoading,
  generateQuestion,
  generateFeedback,
  reset,
}: {
  disableAnswerButton: boolean;
  status: Status;
  isLoading: boolean;
  generateQuestion: (difficulty: QuestionDifficulty) => void;
  generateFeedback: () => void;
  reset: () => void;
}) => {
  return (
    <div className="flex gap-2">
      {status === "awaiting-answer" ? (
        <>
          <Button
            onClick={reset}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            <LoadingSwap isLoading={isLoading}>Skip</LoadingSwap>
          </Button>
          <Button
            onClick={generateFeedback}
            disabled={disableAnswerButton}
            size="sm"
            className="cursor-pointer"
          >
            <LoadingSwap isLoading={isLoading}>Answer</LoadingSwap>
          </Button>
        </>
      ) : (
        questionDifficulties.map((difficulty) => (
          <Button
            key={difficulty}
            size="sm"
            disabled={isLoading}
            className="cursor-pointer"
            onClick={() => {
              generateQuestion(difficulty);
            }}
          >
            <LoadingSwap isLoading={isLoading}>
              {formatQuestionDifficulty(difficulty)}
            </LoadingSwap>
          </Button>
        ))
      )}
    </div>
  );
};
