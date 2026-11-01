export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("JARVIS SYSTEM ONLINE 🤖");
    }

    if (url.pathname === "/webhook" && request.method === "POST") {
      const update = await request.json();
      const msg = update.message;

      if (msg?.text) {
        let reply = "Command received: " + msg.text;

        if (msg.text === "/start") {
          reply = "Welcome Commander! JARVIS is Online 🤖";
        } else if (msg.text === "/help") {
          reply = "Commands: /start /help /time /date /status";
        } else if (msg.text === "/time") {
          reply = new Date().toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata"
          });
        } else if (msg.text === "/date") {
          reply = new Date().toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata"
          });
        } else if (msg.text === "/status") {
          reply = "JARVIS ONLINE ✅";
        }

        await fetch(
          `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: msg.chat.id,
              text: reply
            })
          }
        );
      }

      return new Response("OK");
    }

    return new Response("Not Found", { status: 404 });
  }
};
