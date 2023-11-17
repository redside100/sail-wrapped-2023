export const AUTH_URL =
  process.env.NODE_ENV === "development"
    ? "https://discord.com/api/oauth2/authorize?client_id=1174821530623021128&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify%20guilds"
    : "https://discord.com/api/oauth2/authorize?client_id=1174821530623021128&redirect_uri=https%3A%2F%2Fsailwrapped.com&response_type=code&scope=identify%20guilds";

export const API_BASE = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://sailwrapped.com";
export const DISCORD_CDN_BASE = "https://cdn.discordapp.com"