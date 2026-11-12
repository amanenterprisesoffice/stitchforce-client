import React from "react"

const Signature  = () => {
  return (
    <p className="absolute bottom-6 text-xs text-muted-foreground">
      © {new Date().getFullYear()} StitchForce. All rights reserved.
    </p>
  )
}

export default Signature
