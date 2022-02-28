import React, { useEffect, useState } from "react"
import { ContentLayout } from "../../src/components/Layout"
import { } from "@dataesr/react-dsfr"
import {
  Button,
  ButtonGroup,
  Col,
  Modal,
  Row,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap"
import { useRouter } from "next/router"
import {
  RequestContact,
  STORAGE_CONTACT_HOURS,
  STORAGE_CONTACT_TYPE,
} from "../../src/constants/constants"
import { WidgetHeader } from "../../src/components/WidgetHeader"
import { getLocaleInLocalStorage } from "../../src/utils/main.utils"
import { CATEG, trackerClick } from "../../src/utils/tracker.utils"

export default function ToBeContacted() {
  const router = useRouter()

  const localeSelected = getLocaleInLocalStorage()

  const [contactHours, setContactHours] = useState(defaultContactHours)
  const [itemValueType, setItemValueType] = useState()
  const [isSmsSelected, setSmsSelected] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  useEffect(() => {
    setSmsSelected(itemValueType == RequestContact.type.sms)

    if (itemValueType == RequestContact.type.email)
      setContactHours(defaultContactHours)
  }, [itemValueType])

  const cancel = () => {
    router.back()
  }

  const goToContactForm = () => {
    localStorage.setItem(STORAGE_CONTACT_TYPE, itemValueType)
    localStorage.setItem(
      STORAGE_CONTACT_HOURS,
      convertHoursListInString(contactHours)
    )

    router.push({
      pathname: "/contact/contact-form",
    })
  }

  const onValidate = async (event) => {
    trackerClick(
      CATEG.contact,
      "Choix du type de prise de contact",
      itemValueType
    )

    if (itemValueType == RequestContact.type.chat) {
      handleShow()
    } else goToContactForm()
  }

  const customToggleButton = (type) => (
    <ToggleButton
      className="contact-card"
      key={type.id}
      id={`radio-type-${type.id}`}
      type="radio"
      name="radio-type"
      value={type.id}
      checked={itemValueType === type.id}
      onChange={(e) => setItemValueType(e.currentTarget.value)}
    >
      <Row className="card-center-img">
        <img
          alt=""
          src={itemValueType === type.id ? type.iconSelected : type.icon}
          height={50}
        />
        {type.text}
      </Row>
    </ToggleButton>
  )

  const ButtonGroupType = () => (
    <ButtonGroup className="be-contacted-button-group">
      <Col>
        Maintenant par :
        <Row>
          {defaultContactTypes.byNow.map((type) => (
            <Col key={type.id}>{customToggleButton(type)}</Col>
          ))}
        </Row>
        Selon mes disponibilités, par :
        <Row>
          {defaultContactTypes.byAvailabilities.map((type) => (
            <Col key={type.id}>{customToggleButton(type)}</Col>
          ))}
        </Row>
      </Col>
    </ButtonGroup>
  )

  const updateItemSelected = (list, itemSelected) =>
    list.map((item) => {
      if (item.id === itemSelected.id)
        return { ...item, isChecked: !itemSelected.isChecked }

      return item
    })

  const buttonGroupHours = () => (
    <ToggleButtonGroup
      type="checkbox"
      className="be-contacted-button-group-checkbox"
    >
      {contactHours.map((type, idx) => (
        <ToggleButton
          className="contact-card"
          key={idx}
          id={`checkbox-hours-${idx}`}
          type="checkbox"
          name="checkbox-hours"
          value={type.id}
          onChange={(e) =>
            setContactHours(updateItemSelected(contactHours, type))
          }
        >
          <Row className="card-center-img">
            <img
              alt=""
              src={type.isChecked ? type.iconSelected : type.icon}
              height={50}
            />
            {type.text}
          </Row>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )

  return (
    <ContentLayout>
      <WidgetHeader title="être contacté(e)" locale={localeSelected} />
      <p>
        Se rendre disponible en tant que parent n'est pas toujours simple. Nous
        vous proposons de choisir le créneau et le type de prise de contact qui
        vous conviennent.
      </p>
      <p>Par quel moyen préférez-vous être contacté(e) ?</p>
      <ButtonGroupType />

      {isSmsSelected ? (
        <>
          <div className="margin-bottom-8">
            Quelles sont vos disponibilités pour être contacté(e) ? (du lundi au vendredi)
          </div>
          {buttonGroupHours()}
        </>
      ) : null}

      <Col className="be-contacted-bottom-buttons">
        <button className="fr-btn fr-btn--secondary" onClick={cancel}>
          Annuler
        </button>
        <button
          className="fr-btn"
          disabled={!isValidButtonEnabled(itemValueType, contactHours)}
          onClick={onValidate}
        >
          Valider
        </button>
      </Col>

      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Être contacté(e) par chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Merci pour l'intérêt que vous portez à ce type de prise de contact, cette fonctionnalité sera bientôt disponible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            J'ai compris
          </Button>
        </Modal.Footer>
      </Modal>
    </ContentLayout>
  )
}

const defaultContactTypes = {
  byNow: [
    {
      icon: "../img/contact/chat.svg",
      iconSelected: "../img/contact/chat-selected.svg",
      id: RequestContact.type.chat,
      isChecked: false,
      text: "Par chat",
    },
  ],
  byAvailabilities: [
    {
      icon: "../img/contact/sms.svg",
      iconSelected: "../img/contact/sms-selected.svg",
      id: RequestContact.type.sms,
      isChecked: false,
      text: "Par SMS",
    },
    {
      icon: "../img/contact/email-contact.svg",
      iconSelected: "../img/contact/email-contact-selected.svg",
      id: RequestContact.type.email,
      isChecked: false,
      text: "Par email",
    },
  ],
}

const defaultContactHours = [
  {
    hours: "9h - 12h",
    icon: "../img/contact/soleil-matin.svg",
    iconSelected: "../img/contact/soleil-matin-selected.svg",
    id: RequestContact.hours.morning,
    isChecked: false,
    text: "En matinée",
  },
  {
    hours: "12h - 14h",
    icon: "../img/contact/soleil-midi.svg",
    iconSelected: "../img/contact/soleil-midi-selected.svg",
    id: RequestContact.hours.noon,
    isChecked: false,
    text: "Le midi",
  },
  {
    hours: "14h - 17h30",
    icon: "../img/contact/soleil-soir.svg",
    iconSelected: "../img/contact/soleil-soir-selected.svg",
    id: RequestContact.hours.afternoon,
    isChecked: false,
    text: "L'après-midi",
  },
]

/**
 * @param {Array} hours Tableau des heures
 * @returns La liste des heures au format String
 */
export const convertHoursListInString = (hours) =>
  hours.reduce(
    (hoursString, hour) =>
      hour.isChecked ? `${hoursString} ${hour.id}` : hoursString,
    ""
  )

/**
 * @param {RequestContact.type} itemValueType Type du mode de contact sélectionné (Email/ SMS)
 * @param {Array} contactHours Tableau des heures
 * @returns boolean de la validité des choix seléctionnés
 */
export const isValidButtonEnabled = (itemValueType, contactHours) => {
  const isHoursSelected =
    contactHours?.find((item) => item.isChecked) != undefined

  return itemValueType == RequestContact.type.email ||
    itemValueType == RequestContact.type.chat ||
    (itemValueType == RequestContact.type.sms && isHoursSelected)
}