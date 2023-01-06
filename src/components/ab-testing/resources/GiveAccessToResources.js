import { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import { STORAGE_TEST_ABC } from "../../../constants/constants"
import * as StorageUtils from "../../../utils/storage.utils"
import * as AbTestingUtils from "../../../utils/ab-testing/ab-testing.utils"
import { client, DEMANDE_RESSOURCES } from "../../../../apollo-client"
import { useMutation } from "@apollo/client"
import { LoaderFoButton } from "../../../utils/main.utils"
import Button from "@codegouvfr/react-dsfr/Button"

export const GiveAccessToResources = () => {
  const RESOURCES_URL = process.env.NEXT_PUBLIC_LANDING_PAGE_BLUES_RESOURCES
  const test = StorageUtils.getInLocalStorage(STORAGE_TEST_ABC)

  const [show, setShow] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [mailValue, setMailValue] = useState()

  const openUrl = (url) => window.open(url, "_blank")
  const handleChange = (event) => setMailValue(event.target.value)
  const openModal = () => setShow(true)
  const closeModal = () => setShow(false)

  const shouldSendEmail = () =>
    test === AbTestingUtils.TEST.A || test === AbTestingUtils.TEST.B

  useEffect(() => {
    shouldSendEmail()
      ? AbTestingUtils.trackerForAbTesting(
        "Je souhaite recevoir les ressources par mail"
      )
      : AbTestingUtils.trackerForAbTesting(
        "Afficher les ressources disponibles"
      )
  }, [])

  const componentForRedirection = () => {
    return (
      <Button
        className="fr-btn--secondary"
        onClick={() => openUrl(RESOURCES_URL)}
      >
        Afficher les ressources disponibles
      </Button>
    )
  }

  const [sendResourcesQuery] = useMutation(DEMANDE_RESSOURCES, {
    client: client,
    onCompleted: () => {
      setLoading(false)
      closeModal()
    },
    onError: (err) => {
      console.error(err)
      setLoading(false)
    },
  })

  const sendMail = async () => {
    setLoading(false)
    AbTestingUtils.trackerForAbTesting(
      "Je souhaite recevoir les ressources par mail - Envoie du mail"
    )

    setLoading(true)
    await sendResourcesQuery({
      variables: {
        email: mailValue,
      },
    })
  }

  const componentToSendMail = () => {
    return (
      <div>
        <Button priority="secondary" onClick={() => openModal()}>
          Je souhaite recevoir les ressources par mail
        </Button>

        <Modal show={show} centered size="lg">
          <Modal.Header className="fr-modal__header">
            <Button
              priority="tertiary no outline"
              className="fr-btn--close"
              aria-controls="fr-modal-2"
              onClick={closeModal}
            >
              Fermer
            </Button>
          </Modal.Header>

          <Modal.Body>
            <div className="fr-input-group">
              <label className="fr-label" htmlFor="email-resources">
                Recevez nos ressources orientées sur les difficultés maternelles
                dans votre boite mail
                <span className="fr-hint-text">
                  Format attendu : nom@domaine.fr
                </span>
              </label>
              <input
                className="fr-input"
                name="email"
                autoComplete="email"
                id="email-resources"
                type="email"
                onChange={handleChange}
                value={mailValue}
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={() => sendMail()} disabled={isLoading}>
              Envoyer
              {isLoading ? <LoaderFoButton /> : null}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }

  return (
    <div>
      {shouldSendEmail() ? componentToSendMail() : componentForRedirection()}
    </div>
  )
}
