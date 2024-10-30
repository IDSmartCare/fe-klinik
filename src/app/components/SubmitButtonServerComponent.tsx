"use client";

import { useFormStatus } from "react-dom";

export function SubmitButtonServer() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn btn-sm btn-primary btn-block"
      disabled={pending}
    >
      Submit
    </button>
  );
}
