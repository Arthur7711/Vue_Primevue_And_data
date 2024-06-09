export type IButtonSize = { width: string; height: string } | 's' | 'xl'
export type IButtonColorScheme = 'primary' | 'secondary' | 'tertiary' | 'danger'
export interface UIButtonStyleProps {
  disable?: boolean
  show_icon?: boolean
  icon_side?: 'left' | 'right'
  size?: IButtonSize
  colorScheme?: IButtonColorScheme
  isUpdate?: boolean
}
