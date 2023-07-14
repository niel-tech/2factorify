"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="my-2 w-full"
    >
      <div className="m-auto grid max-w-lg grid-cols-2 items-center px-4 transition-all">
        <div className="justify-start">
          {new Date().getFullYear()}
        </div>
        <div className="grid grid-flow-row justify-end">
          template
        </div>
      </div>
    </motion.footer>
  )
}
