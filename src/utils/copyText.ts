import { notification } from 'ant-design-vue'

export default (text) => {
  if (!navigator.clipboard) return
  navigator.clipboard.writeText(text)
  notification.success({ message: 'Copied to clipboard' })
}
