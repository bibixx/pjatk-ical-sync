export function parseViewStateTokens(html: string) {
  const viewState = html.match(/name="__VIEWSTATE"[^>]*value="([^"]*)"/);
  const eventValidation = html.match(/name="__EVENTVALIDATION"[^>]*value="([^"]*)"/);
  const viewStateGen = html.match(/name="__VIEWSTATEGENERATOR"[^>]*value="([^"]*)"/);

  if (!viewState || !eventValidation) {
    throw new Error("Could not find VIEWSTATE tokens in the page.");
  }

  return {
    viewState: viewState[1],
    eventValidation: eventValidation[1],
    viewStateGenerator: viewStateGen?.[1],
  };
}
