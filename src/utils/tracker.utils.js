export const EVENT_CLICK = "Click"

export const CATEG = {
  contact: "Contact",
  home: "Home",
  survey: "Questionnaire",
}

export const trackerClick = (categ, action, name) => {
  if (process.env.NEXT_PUBLIC_MATOMO_ENABLED === "true")
    _paq.push(["trackEvent", categ, action, name])
}
