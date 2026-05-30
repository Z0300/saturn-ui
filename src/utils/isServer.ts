import { environmentManager } from "@tanstack/react-query";

export const isServer = () => environmentManager.isServer();
