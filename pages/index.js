import styles from "../styles/Home.module.css"
import { Row } from "react-bootstrap"
import { } from "@dataesr/react-dsfr"
import { useEffect, useState } from "react"
import {
  DEFAULT_LOCAL,
  STORAGE_LOCALE,
  STORAGE_SOURCE,
} from "../src/constants/constants"
import { EVENT_CLICK, trackerClick } from "../src/utils/tracker.utils"
import { useRouter } from "next/router"
import { useLazyQuery } from "@apollo/client"
import { client, GET_LOCALES, LABELS_EPDS_TRADUCTION } from "../apollo-client"
import { WidgetHeader } from "../src/components/WidgetHeader"
import Image from "next/image"
import { convertArrayLabelsToObject } from "../src/utils/main.utils"

export default function Home() {
  const router = useRouter()

  const [source, setSource] = useState()
  const [localeSelected, setLocaleSelected] = useState()
  const [labelsTranslated, setLabelsTranslated] = useState()

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params = Object.fromEntries(urlSearchParams.entries())
    setSource(params.source)

    const localesQuery = async () => {
      await getLocalesInDatabase()
    }
    localesQuery()
  }, [])

  const startSurvey = () => {
    localStorage.setItem(STORAGE_SOURCE, source)
    trackerClick("Home", EVENT_CLICK, "Commencer le test")

    goToEpdsSurvey()
  }

  const goToEpdsSurvey = async (event) => {
    router.push({
      pathname: "/epds-survey",
    })
  }

  const [getLabelsTranslationsQuery] = useLazyQuery(LABELS_EPDS_TRADUCTION, {
    client: client,
    onCompleted: (data) => {
      const labelsData = data.labelsEpdsTraductions[0]?.labels
      const labels = convertArrayLabelsToObject(labelsData)
      setLabelsTranslated(labels)
    },
    onError: (err) => {
      console.warn(err)
    },
  })

  const [getLocalesInDatabase] = useLazyQuery(GET_LOCALES, {
    client: client,
    onCompleted: (data) => {
      const locale = data.locales.find(
        (element) => element.identifiant === DEFAULT_LOCAL
      )
      setLocaleSelected(locale)
      localStorage.setItem(STORAGE_LOCALE, JSON.stringify(locale))

      const translationQuery = async () => {
        await getLabelsTranslationsQuery({
          variables: { locale: locale.identifiant },
        })
      }
      translationQuery()
    },
    onError: (err) => {
      console.warn(err)
    },
  })

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <WidgetHeader localeFlag={localeSelected?.drapeau.url} />
        <Image
          src="/img/logo-1000j.svg"
          alt="Logo 1000 premiers jours"
          height={130}
          width={130}
        />
        <Row className="slogan">
          {labelsTranslated?.slogan
            ? labelsTranslated.slogan
            : "FFFFuturs parents, parents, évaluez votre bien être émotionnel en quelques minutes"}
        </Row>
        <br />
        <button
          className="fr-btn fr-btn--lg"
          onClick={startSurvey}
          disabled={!source}
          style={{ marginBottom: "5%" }}
        >
          COMMENCER LE TEST
        </button>
      </div>
    </div>
  )
}
