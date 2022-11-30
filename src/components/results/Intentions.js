import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { ButtonGroup, ToggleButton } from "react-bootstrap"
import { trackerForIntentions } from "../../utils/ab-testing/measuring-intentions.utils"
import * as PdfUtils from "../../utils/pdf.utils"
import { RecruitParents } from "./RecruitParents"

/**
 * @param {number} moodLevel
 * @returns Bloc des intentions
 */
export const Intentions = ({ moodLevel }) => {
  const router = useRouter()

  const [radioValue, setRadioValue] = useState()
  const [itemSelected, setItemSelected] = useState(false)

  const questionAboutScore = {
    question: "À qui allez-vous parler de votre score ?",
    responses: [
      { name: "À Élise, présidente de l'association Maman Blues", id: 1 },
      { name: "Mon entourage", id: 2 },
      { name: "Mon professionnel de santé", id: 3 },
      { name: "Je le garde pour moi", id: 4 },
    ],
  }
  const DISPLAY_IMAGE_FOR_RESPONSE_ID = 1

  useEffect(() => {
    openContact()
  }, [openContact, radioValue])

  const openContact = () => {
    const itemToElise = questionAboutScore.responses.find(
      (item) => item.id == DISPLAY_IMAGE_FOR_RESPONSE_ID
    )
    if (itemToElise.name === radioValue)
      router.push({ pathname: "/contact/to-be-contacted" })
  }

  const onToggleButon = (value) => {
    setRadioValue(value)
    setItemSelected(true)
    trackerForIntentions(moodLevel, value)
  }

  const questionBlock = (question) => {
    return (
      <div className="buttons-block">
        <div>
          <b>{question.question}</b>
        </div>
        <ButtonGroup>
          {question.responses.map((radio) => (
            <ToggleButton
              className="intentions-button fr-btn--tertiary"
              key={radio.id}
              id={`radio-${radio.id}`}
              type="radio"
              name="radio"
              value={radio.name}
              checked={radioValue === radio.name}
              onChange={(event) => onToggleButon(event.currentTarget.value)}
              disabled={itemSelected}
            >
              {radio.name}
              {radio.id == 1 && <img alt="" src="../img/portrait-elise.jpg" />}
            </ToggleButton>
          ))}
        </ButtonGroup>
        <div>{itemSelected && "Merci pour votre réponse"}</div>
      </div>
    )
  }

  const DownloadEpdsResponsesBtn = () => {
    return (
      <div
        className="fr-download intention-download"
        onClick={downloadEpdsResponses}
      >
        <span className="fr-download__link">
          <u>Télécharger mes réponses au questionnaire EPDS</u>
        </span>
        <span className="fr-download__detail">PDF</span>
      </div>
    )
  }

  const downloadEpdsResponses = () => {
    PdfUtils.generateEpdsResultsPdf()
    trackerForIntentions(moodLevel, "Télécharger mes réponses")
  }

  return (
    <div className="intentions">
      <div className="intentions-card">
        {questionBlock(questionAboutScore)}
        <DownloadEpdsResponsesBtn />
        <RecruitParents />
      </div>
    </div>
  )
}