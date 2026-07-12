import React from "react"
import BaseInput from "@/components/widgets/form/fields/BaseInput"
import TextArea from "@/components/widgets/form/fields/TextArea"
import Selection from "@/components/widgets/form/fields/Selection"
import Toggle from "@/components/widgets/form/fields/Toggle"
import FileUpload from "@/components/widgets/form/fields/FileUpload"
import ManyToManyList from "./fields/ManyToManyList"

export default function FormField({ field, value, onChange, disabled }) {
  switch (field.type) {
    case "text":
    case "password":
    case "number":
    case "date":
    case "time":
    case "datetime-local":
      return <BaseInput field={field} value={value} onChange={onChange} disabled={disabled} />

    case "textarea":
    case "editor":
    case "texteditor":
      return <TextArea field={field} value={value} onChange={onChange} disabled={disabled} />

    case "select":
    case "manytoone":
      return <Selection field={field} value={value} onChange={onChange} disabled={disabled} />

    case "switch":
    case "checkbox":
      return <Toggle field={field} value={value} onChange={onChange} disabled={disabled} />

    case "image":
    case "file":
    case "media":
      return <FileUpload field={field} value={value} onChange={onChange} disabled={disabled} />

    case "onetomany":
    case "manytomanylist":
      return <ManyToManyList field={field} value={value} onChange={onChange} disabled={disabled}/>

    default:
      return null
  }
}