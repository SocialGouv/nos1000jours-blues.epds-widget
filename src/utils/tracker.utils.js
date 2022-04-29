export const EVENT_CLICK = "Click"

export const CATEG = {
  contact: "Contact",
  home: "Home",
  survey: "Questionnaire",
}

export const ACTION = {
  contact_confirm_sent: "Confirmation d'envoi de la demande de contact",
  contact_type: "Choix du type de prise de contact",
}

export const CONTACT_SENT = {
  chat: "ouverture_chat",
  mail: "confirmation_mail",
  sms: "confirmation_sms",
}

export const trackerClick = (categ, action, name) => {
  if (process.env.NEXT_PUBLIC_MATOMO_ENABLED === "true")
    _paq.push(["trackEvent", categ, action, name])
}