export function IconSide(side?: 'left' | 'right'): 'row' | 'row-reverse' {
  return side ? (side === 'left' ? 'row' : 'row-reverse') : 'row'
}
