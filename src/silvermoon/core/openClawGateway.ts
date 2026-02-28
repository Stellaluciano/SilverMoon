import { SilvermoonAgent } from "./silvermoonAgent";

export class OpenClawGateway {
  constructor(private readonly agent: SilvermoonAgent) {}

  async routeMessage(input: string): Promise<string> {
    return this.agent.processInput(input);
  }
}
