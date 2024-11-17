export const AUTH_URL =
  process.env.NODE_ENV === "development"
    ? "https://discord.com/api/oauth2/authorize?client_id=1174821530623021128&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify%20guilds"
    : "https://discord.com/oauth2/authorize?client_id=1174821530623021128&response_type=code&redirect_uri=https%3A%2F%2Fsw2023.redside.moe&scope=guilds+identify";

export const API_BASE = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://api.sw2023.redside.moe";
export const DISCORD_CDN_BASE = "https://cdn.discordapp.com"

export const LEADERBOARD_TAB = {
  MESSAGES_SENT: "Messages Sent",
  TOTAL_ATTACHMENTS_SIZE: "Total Attachments Size",
  MENTIONS_RECEIVED: "Mentions Received",
  MENTIONS_GIVEN: "Mentions Given",
  REACTIONS_RECEIVED: "Reactions Received",
  REACTIONS_GIVEN: "Reactions Given",
  PATTERN: "Message Pattern",
};