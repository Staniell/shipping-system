import { useState } from 'react'
import AutoSuggestInput from '../common/AutoSuggestInput'
import TextInput from '../common/TextInput'
import Button from '../common/Button'
import { NewShipment, Shipment } from '../../types/workspace'

export default function ShipmentForm({
  onSubmit,
  buildOptions,
  shipment,
}: {
  onSubmit: (shipment: NewShipment) => void
  buildOptions?: any[]
  shipment?: Shipment & { buildNumber: string }
}) {
  const [formValues, setFormValues] = useState<NewShipment>({
    description: shipment?.description ?? '',
    orderNumber: shipment?.orderNumber ?? '',
    cost: shipment?.cost ?? 0,
    buildNumber: shipment?.buildNumber ?? '',
  })

  const isButtonEnabled =
    formValues.description && formValues.orderNumber && formValues.cost && formValues.buildNumber

  const isEdit = !!shipment

  return (
    <div className="rounded-lg bg-white p-4">
      <h4 className="text-lg font-bold">{isEdit ? 'Edit' : 'Add New'} Shipment</h4>
      <p className="mb-4 text-sm text-gray-600">
        {isEdit ? 'Update the details for this shipment' : 'Add a new shipment to Global Logistics Hub'}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(formValues)
        }}
        onChange={(e: any) => {
          setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
          })
        }}
        action="w-full"
      >
        {!isEdit && (
          <div>
            <AutoSuggestInput
              label="Build Shipment"
              placeholder="Type or select a build number"
              options={buildOptions ?? []}
              getLabel={(option) => option.name}
              getValue={(option) => option.id}
              name="buildNumber"
              onSelect={(value) => {
                setFormValues({
                  ...formValues,
                  buildNumber: value,
                })
              }}
            />
          </div>
        )}

        <TextInput
          label="Description"
          placeholder="e.g. 64 units"
          name="description"
          defaultValue={formValues.description}
        />

        <TextInput
          label="Order Number"
          placeholder="Order Number"
          name="orderNumber"
          defaultValue={formValues.orderNumber}
        />

        <TextInput
          label="Cost"
          placeholder="Cost"
          type="number"
          name="cost"
          defaultValue={formValues.cost}
        />

        <div className="mx-auto mt-4 w-fit">
          <Button type="submit" disabled={!isButtonEnabled}>
            {isEdit ? 'Save Changes' : 'Add Shipment'}
          </Button>
        </div>
      </form>
    </div>
  )
}
