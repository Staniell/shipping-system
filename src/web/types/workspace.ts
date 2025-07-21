export interface WorkSpaceType {
  id: string
  title: string
  buildShipments: BuildShipment[]
}

export interface BuildShipment {
  id: string
  buildNumber: string
  shipments: Shipment[]
}

export interface Shipment {
  id: string
  description: string
  orderNumber: string
  cost: number
}

export interface NewShipment {
  buildNumber: string
  description: string
  orderNumber: string
  cost: number
}
