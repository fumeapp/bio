import type { Cartridge, Shot } from '~/types/models'

export const useShot = () => {
  const takenUnits = (shots: Shot[]): number =>
    shots.reduce((sum, shot) => sum + shot.units, 0)
  const totalUnits = (cartridge: Cartridge): number =>
    (cartridge.ml as unknown as number) * 100

  const remainingUnits = (shots: Shot[], cartridge: Cartridge): number =>
    totalUnits(cartridge) - takenUnits(shots)

  return {
    takenUnits,
    totalUnits,
    remainingUnits,
  }
}
