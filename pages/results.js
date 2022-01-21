import { Row } from "react-bootstrap"
import { ContentLayout } from "../src/components/Layout"
import { ResultsMood } from "../src/components/results/ResultsMood"
import {
  STORAGE_SCORE_LEVEL_MOOD,
  STORAGE_SCORE_LEVEL_TEXTS,
} from "../src/constants/constants"
import { EpdsResultsComments, Labels } from "../src/constants/specificLabels"
import { getInLocalStorage } from "../src/utils/utils"

export default function Results() {
  const scoreLevelForMood = parseInt(
    getInLocalStorage(STORAGE_SCORE_LEVEL_MOOD)
  )
  const scoreLevelForTexts = parseInt(
    getInLocalStorage(STORAGE_SCORE_LEVEL_TEXTS)
  )

  return (
    <ContentLayout>
      <h5 className="title-ddp">{Labels.titleDPP}</h5>
      <ResultsMood scoreLevel={scoreLevelForMood} />
      <Row>
        <b>Oser en parler, c’est déjà prendre soin de soi et de son enfant !</b>
        <br />
        <span>{descriptionByScoreLevel(scoreLevelForTexts)}</span>
        <br />
        <b>{conclusionByScoreLevel(scoreLevelForTexts)}</b>
      </Row>
    </ContentLayout>
  )
}

export const descriptionByScoreLevel = (level) => {
  switch (level) {
    case 1:
      return EpdsResultsComments.level1.description
    case 2:
      return EpdsResultsComments.level2.description
    case 3:
      return EpdsResultsComments.level3.description
    default:
      return "Pas de description disponible"
  }
}

export const conclusionByScoreLevel = (level) => {
  switch (level) {
    case 1:
      return EpdsResultsComments.level1.conclusion
    case 2:
      return EpdsResultsComments.level2.conclusion
    case 3:
      return EpdsResultsComments.level3.conclusion
    default:
      return "Pas de conclusion disponible"
  }
}
