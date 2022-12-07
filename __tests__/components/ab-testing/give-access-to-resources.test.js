import { render, screen } from "@testing-library/react"
import { GiveAccessToResources } from "../../../src/components/ab-testing/resources/GiveAccessToResources"
import { STORAGE_TEST_ABC } from "../../../src/constants/constants"
import * as AbTestingUtils from "../../../src/utils/ab-testing/ab-testing.utils"

describe("UI de GiveAccessToResources", () => {
  describe("TEST A/B/C/D", () => {
    const mailBtnText = "Je souhaite recevoir les ressources par mail"
    const linkBtnText = "Afficher les ressources disponibles"

    test("Should return modal with email when test is A", async () => {
      localStorage.setItem(STORAGE_TEST_ABC, AbTestingUtils.TEST.A)
      const { container } = render(<GiveAccessToResources />)

      const button = screen.getByRole("button", { name: mailBtnText })
      expect(button).toBeInTheDocument()
    })

    test("Should return modal with email when test is B", async () => {
      localStorage.setItem(STORAGE_TEST_ABC, AbTestingUtils.TEST.B)
      const { container } = render(<GiveAccessToResources />)

      const button = screen.getByRole("button", { name: mailBtnText })
      expect(button).toBeInTheDocument()
    })

    test("Should return link when test is C", async () => {
      localStorage.setItem(STORAGE_TEST_ABC, AbTestingUtils.TEST.C)
      const { container } = render(<GiveAccessToResources />)

      const button = screen.getByRole("button", { name: linkBtnText })
      expect(button).toBeInTheDocument()
    })

    test("Should return link when test is D", async () => {
      localStorage.setItem(STORAGE_TEST_ABC, AbTestingUtils.TEST.D)
      const { container } = render(<GiveAccessToResources />)

      const button = screen.getByRole("button", { name: linkBtnText })
      expect(button).toBeInTheDocument()
    })
  })
})
