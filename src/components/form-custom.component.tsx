"use client";

import { ComponentProps } from "react";

import cn from "@/lib/tw-merge";

type FormCustomProps = ComponentProps<"form">;

/** RHF/Zod validation only — disables native browser constraint UI. */
const FormCustom = ({ className, children, ...props }: FormCustomProps) => (
  <form noValidate className={cn(className)} {...props}>
    {children}
  </form>
);

export default FormCustom;
