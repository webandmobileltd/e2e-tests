export class By {
  public static dataQa(dataQa: string, tag: string = ''): string {
    return `${tag}[data-qa="${dataQa}"]`;
  }
  public static dataState(dataState: string): string {
    return `[data-state="${dataState}"]`;
  }
}
