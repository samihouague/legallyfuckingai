import { vllm, ollm } from "./models.mjs";
import { createMiddleware } from "langchain";

export const dynamicModelSelection = createMiddleware({
  name: "DynamicModelSelection",
  wrapModelCall: (request, handler) => {
    const messageCount = request.messages.length;

    return handler({
        ...request,
        model: messageCount > 10 ? vllm : ollm,
    });
  },
});