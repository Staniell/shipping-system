import React from 'react'
import TextInput from '../common/TextInput'
import Button from '../common/Button'

export default function BuildShipmentForm({
  onSubmit,
  data,
}: {
  onSubmit: (buildNumber: string) => void
  data?: any
}) {
  const [formValues, setFormValues] = React.useState({
    buildNumber: data?.buildNumber ?? '',
  })

  const isButtonEnabled = formValues.buildNumber

  const isEdit = !!data

  return (
    <div className="rounded-lg bg-white p-4">
      <form
        onSubmit={(e: any) => {
          e.preventDefault()
          onSubmit(formValues.buildNumber)
        }}
        onChange={(e: any) => {
          setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
          })
        }}
      >
        <h4 className="mb-4 mt-2 text-lg font-bold">
          {isEdit ? 'Edit' : 'Add New'} Build Shipment
        </h4>

        <TextInput
          label="Build Number"
          name="buildNumber"
          type="text"
          placeholder="Build Number"
          defaultValue={formValues.buildNumber}
        />
        <div className="mx-auto mt-4 block w-fit">
          <Button type="submit" disabled={!isButtonEnabled}>
            {isEdit ? 'Save Changes' : 'Add Build Shipment'}
          </Button>
        </div>
      </form>
    </div>
  )
}
