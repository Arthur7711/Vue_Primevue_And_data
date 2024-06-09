import { type IButtonSize } from '../types'

export const ButtonWidth = (val?: IButtonSize): string => {
  if (val) {
    return val === 's' || val === 'xl' ? 'max-content' : val.width ? `${val.width}` : 'max-content'
  } else {
    return 'max-content'
  }
} 

export const ButtonHeight = (val?: IButtonSize): string => {
  if (val) {
    return val === 's' ? '36px' : val === 'xl' ? '44px' : val.width ? `${val.height}` : '36px'
  } else {
    return '36px'
  }
}
