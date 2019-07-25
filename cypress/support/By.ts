export class By {
  public static dataQa(dataQa: string, tag: string = ''): string {
    return `${tag}[data-qa="${dataQa}"]`;
  }

  public static dataState(dataState: string, dataQa?: string): string {
    return `[data-state="${dataState}"]${
      dataQa ? `[data-qa="${dataQa}"]` : ''
      }`;
  }

  public static dataBoclipsPlayerInitialised(): string {
    return '[data-boclips-player-initialised=true]';
  }

  public static boclipsPlayerPlayButton(): string {
    return `${this.dataBoclipsPlayerInitialised()} button`;
  }
}
