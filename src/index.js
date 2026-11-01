export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("JARVIS SYSTEM ONLINE 🤖");
    }

    if (url.pathname === "/webhook" && request.method === "POST") {
      try {
        if (!env.BOT_TOKEN) {
          console.error("BOT_TOKEN secret missing!");
          return new Response("BOT_TOKEN missing", { status: 500 });
        }

        const update = await request.json();
        const msg = update.message;

        if (msg?.text) {
          const command = msg.text.trim()
            .split(/\s+/)[0]
            .split("@")[0]
            .toLowerCase();

          let reply = "Command received: " + msg.text;

          switch (command) {
            case "/start":
              reply = "Welcome Commander! JARVIS is Online 🤖";
              break;

            case "/help":
              reply = "Commands: /start /help /time /date /status";
              break;

            case "/time":
              reply = new Date().toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata"
              });
              break;

            case "/date":
              reply = new Date().toLocaleDateString("en-IN", {
                timeZone: "Asia/Kolkata"
              });
              break;

            case "/status":
              reply = "JARVIS ONLINE ✅";
              break;
          }

          const response = await fetch(
            `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                chat_id: msg.chat.id,
                text: reply
              })
            }
          );

          const result = await response.json();

          console.log("Telegram API:", JSON.stringify(result));

          if (!result.ok) {
            console.error("Telegram sendMessage failed:", result);
          }
        }

        return new Response("OK");

      } catch (error) {
        console.error("JARVIS ERROR:", error);
        return new Response("Internal Error", { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
