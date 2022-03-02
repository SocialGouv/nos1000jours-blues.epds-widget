import { useLazyQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { Accordion } from "react-bootstrap"
import { client, GET_RESOURCES_BY_PLATFORM } from "../../../apollo-client"
import { PLARTFORM_FOR_RESOURCES } from "../../constants/constants"
import { convertStringToHTML } from "../../utils/main.utils"

export function Resources() {
  const [resources, setResources] = useState()

  const [getResourcesByPlatform] = useLazyQuery(GET_RESOURCES_BY_PLATFORM, {
    client: client,
    onCompleted: (data) => {
      const resourcesConfigs = data.ressourcesEpds[0].ressources_configs[0]
      setResources(resourcesConfigs)
    },
    onError: (err) => {
      console.warn(err)
    },
  })

  useEffect(() => {
    const resourcesByPlatform = async () => {
      await getResourcesByPlatform({
        variables: { plateforme: PLARTFORM_FOR_RESOURCES },
      })
    }

    resourcesByPlatform()
  }, [])

  const displayContent = () => {
    console.log(resources?.ressources)
    return resources?.ressources.map((item, index) => {
      return (
        <Accordion.Item key={index} eventKey={index}>
          <Accordion.Header>
            {getIconByType(item.type)}
            {item.titre}
          </Accordion.Header>
          <Accordion.Body style={{ display: "flex" }}>
            {convertStringToHTML(item.contenu)}
          </Accordion.Body>
        </Accordion.Item>
      )
    })
  }

  return (
    <div className="resources">
      {convertStringToHTML(resources?.texte_1)}
      <Accordion>{displayContent()}</Accordion>
      {convertStringToHTML(resources?.texte_2)}
    </div>
  )
}

/**
 * @param {String} type Type de la ressource
 * @returns Icon en fonction du type de la ressource
 */
export const getIconByType = (type) => {
  let iconSource
  switch (type) {
    case "pros":
      iconSource = "/img/pro-sante.svg"
      break
    case "ressources":
      iconSource = "/img/pro-sante.svg"
      break
    case "sites":
      iconSource = "/img/telephone.svg"
      break
    case "tels":
      iconSource = "/img/telephone.svg"
      break
  }

  return <img alt="Icon" src={iconSource} className="icon-resource-type" />
}
