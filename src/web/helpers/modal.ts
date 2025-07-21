import { ComponentModalType } from '../components/common/Modal'
import { emitEvent } from './events'

export function componentModal(data?: ComponentModalType | null) {
  emitEvent('componentModal', data || null)
}
