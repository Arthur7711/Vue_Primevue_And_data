import { type IButtonColorScheme } from '../types'

export const PlusColor = (val: IButtonColorScheme): string => {
  return val === 'primary'
    ? 'white'
    : val === 'secondary'
      ? '#162031'
      : val === 'tertiary'
        ? '#1860DC'
        : val === 'danger'
          ? '#FFFFFF'
          : '#FFFFFF'
}
