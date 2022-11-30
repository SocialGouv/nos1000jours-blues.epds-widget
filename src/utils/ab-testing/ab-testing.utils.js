import * as TrackerUtils from "../../utils/tracker.utils"
import * as StorageUtils from "../../utils/storage.utils"
import { STORAGE_TEST_ABC } from "../../constants/constants"

export const TEST = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
}

/**
 * Génère aléatoirement A, B ou C
 * @returns A, B ou C
 */
export const generateRandomTest = () => {
  // expected output: 0, 1, 2 or 3
  switch (getRandomInt(4)) {
    case 0:
      return TEST.A
    case 1:
      return TEST.B
    case 2:
      return TEST.C
    case 3:
      return TEST.D
  }
}

const getRandomInt = (max) => {
  if (typeof window !== "undefined") {
    const randomArray = window.crypto.getRandomValues(new Uint16Array(1))
    const randomVal = randomArray[0]
    return randomVal % max
  }
}

export const trackerForAbTesting = (label) => {
  const id = StorageUtils.getInLocalStorage(STORAGE_TEST_ABC)
  TrackerUtils.trackerClick(
    TrackerUtils.CATEG.test,
    `${TrackerUtils.ACTION.parcours}${id}`,
    label
  )
}