"use client"

import React from "react"

import type { z } from "zod"
import { toast } from "react-toastify"
import type { formSchema } from "./formSchema" // Assuming formSchema is defined in another file
import { useForm } from "react-hook-form" // Assuming form is from react-hook-form
import { useMutation } from "@apollo/client" // Assuming data comes from a mutation
import { CREATE_LINK_MUTATION } from "./graphql" // Assuming the mutation is defined here

const CreateLinkDialog = () => {
  const { register, handleSubmit, reset } = useForm()
  const [createLink] = useMutation(CREATE_LINK_MUTATION)
  const [generatedUrl, setGeneratedUrl] = React.useState("")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data } = await createLink({ variables: values })

    if (data) {
      const fullUrl = `${window.location.origin}/l/${data.createLink.slug}`
      setGeneratedUrl(fullUrl)
      toast({
        title: "Link created!",
        description: "Your link has been generated successfully.",
      })
      reset()
    }
  }

  return (
    <div>
      {/* ... existing code ... */}
      <form onSubmit={handleSubmit(onSubmit)}>{/* ... existing code ... */}</form>
      {generatedUrl && <p>Your generated link: {generatedUrl}</p>}
    </div>
  )
}

export default CreateLinkDialog
