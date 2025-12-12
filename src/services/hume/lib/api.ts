import { env } from "@/data/env/server";
import { HumeClient } from "hume";
import type { ReturnChatEvent } from "hume/api/resources/empathicVoice";

export const fetchChatMessages = async (humeChatId: string) => {
  "use cache";

  const client = new HumeClient({ apiKey: env.HUME_API_KEY });
  const allChatEvents: ReturnChatEvent[] = [];
  const chatEventsIterator = await client.empathicVoice.chats.listChatEvents(
    humeChatId,
    { pageNumber: 0, pageSize: 100 }
  );

  for await (const chatEvent of chatEventsIterator) {
    allChatEvents.push(chatEvent);
  }

  return allChatEvents;
};
