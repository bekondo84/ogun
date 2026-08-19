import React, { useEffect } from "react"
import BaseInput from "@/components/widgets/form/fields/BaseInput"
import TextArea from "@/components/widgets/form/fields/TextArea"
import Selection from "@/components/widgets/form/fields/Selection"
import Toggle from "@/components/widgets/form/fields/Toggle"
import FileUpload from "@/components/widgets/form/fields/FileUpload"
import ManyToMany from "@/components/widgets/form/fields/ManyToMany"
import ManyToOne from "@/components/widgets/form/fields/ManyToOne"
import OneToMany from "@/components/widgets/form/fields/OneToMany"
import MediaField from "./fields/MediaField"
import TextAreaField from "./fields/TextAreaField"

export default function FormField({ field, value, error, onChange, disabled, editMode }) {

  useEffect(() => {
     // console.log('-******************************************* / '+JSON.stringify(editMode))
  }, [field, value])
  const readonly = disabled || editMode == 'V' || editMode==='C' && !field?.editable || editMode == 'U' && !field?.updatable
  switch (field.widget) {
    case "text":
    case "number":    
      return <BaseInput field={field} type={field.widget} value={value} error={error} onChange={onChange} disabled={readonly} />
    
    case "password":
       return <BaseInput field={field} type='password' value='...' error={error} onChange={onChange} disabled={readonly} />
    
    case "date":
       return <BaseInput field={field} type='date' value={value && typeof value === 'string' ? value.substring(0, 16) : (value || "")} error={error} onChange={onChange} disabled={readonly} />
    
    case "datetime-local":
       return <BaseInput field={field} type='datetime-local' value={value && typeof value === 'string' ? value.substring(0, 16) : (value || "")} error={error} onChange={onChange} disabled={readonly} />

    case "time":
       return <BaseInput field={field} type='time' value={value && typeof value === 'string' ? value.substring(0, 16) : (value || "")} error={error} onChange={onChange} disabled={readonly} />

    case "textarea":
    case "editor":
    case "texteditor":
      return <TextAreaField key={field?.fieldName} field={field} value={typeof value === 'string' ? value : ""}  error={error} onChange={onChange} disabled={readonly} className="md:col-span-2" />

    case "select":
    case "manytoone":
      return <ManyToOne field={field} value={value} error={error} onChange={onChange}  disabled={readonly} />

    case "switch":
    case "checkbox":
      return <Toggle field={field} value={value} onChange={onChange} disabled={readonly} />

    case "file":
      return <FileUpload field={field} value={value} onChange={onChange} disabled={readonly} />

    case "image":
    case "media":
      return <MediaField field={field} value={value} onChange={onChange} widthClass="w-48" heightClass="h-24" disabled={readonly} />

    case "manytomany":
    case "manytomanylist":
      return <ManyToMany field={field} value={value} onChange={onChange} disabled={readonly} />

    case "onetomany":
      return <OneToMany field={field} value={value} onChange={onChange} disabled={readonly}/>

    default:
      return null
  }
}