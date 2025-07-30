'use client'

import React from "react"
import { Input } from "@/components/ui/input"

type MaskedInputProps = Omit<React.ComponentProps<typeof Input>, 'onChange'> & {
  mask: string
  value?: string
  onChange?: (value: string) => void
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, value = '', onChange, ...props }, ref) => {
    const applyMask = (inputValue: string, maskPattern: string) => {
      let maskedValue = ''
      let inputIndex = 0
      
      for (let i = 0; i < maskPattern.length && inputIndex < inputValue.length; i++) {
        const maskChar = maskPattern[i]
        const inputChar = inputValue[inputIndex]
        
        if (maskChar === '9') {
          if (/\d/.test(inputChar)) {
            maskedValue += inputChar
            inputIndex++
          } else {
            inputIndex++
            i-- // Stay at the same mask position
          }
        } else if (maskChar === 'A') {
          if (/[a-zA-Z]/.test(inputChar)) {
            maskedValue += inputChar
            inputIndex++
          } else {
            inputIndex++
            i-- // Stay at the same mask position
          }
        } else if (maskChar === '*') {
          maskedValue += inputChar
          inputIndex++
        } else {
          // Fixed character in mask
          maskedValue += maskChar
        }
      }
      
      return maskedValue
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      let cleanValue = ''
      
      // Extract only the characters that match the mask pattern
      for (let i = 0; i < rawValue.length; i++) {
        const char = rawValue[i]
        if (/\d/.test(char)) { // For CEP, only keep digits
          cleanValue += char
        }
      }
      
      const maskedValue = applyMask(cleanValue, mask)
      onChange?.(maskedValue)
    }

    return (
      <Input
        {...props}
        ref={ref}
        value={value}
        onChange={handleChange}
        placeholder={mask.replace(/9/g, '_').replace(/A/g, '_')}
      />
    )
  }
)

MaskedInput.displayName = "MaskedInput"