import React from 'react'
import TextInput from '../common/TextInput'
import Button from '../common/Button'

export default function WorkSpaceForm({ onSubmit }: { onSubmit: (title: string) => void }) {
  const [formValues, setFormValues] = React.useState({
    title: '',
  })

  return (
    <div className="rounded-lg bg-white p-4">
      <form
        onSubmit={(e: any) => {
          e.preventDefault()
          onSubmit(formValues.title)
        }}
        onChange={(e: any) => {
          setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
          })
        }}
      >
        <h4 className="mb-4 text-lg font-bold">Add New Workspace</h4>

        <TextInput label="Workspace Title" name="title" type="text" placeholder="Workspace Title" />
        <div className="mx-auto mt-4 block w-fit">
          <Button type="submit">Add Workspace</Button>
        </div>
      </form>
    </div>
  )
}
