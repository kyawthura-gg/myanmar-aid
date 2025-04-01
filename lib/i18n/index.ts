import { getRequestConfig } from "next-intl/server";
import enMessages from "./locales/en.json";
import mmMessages from "./locales/mm.json";

export default getRequestConfig(async (req) => {
  // Load messages for the requested locale
  let messages = {};
  const locale = req?.locale ?? "en";

  if (locale === "en") {
    messages = enMessages;
  } else {
    messages = mmMessages;
  }

  return {
    locale,
    messages,
  };
});
