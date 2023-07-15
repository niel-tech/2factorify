"use client"

import Link from "next/link"
import useSWR from "swr"
import { ValidUntil } from "../../../components/ValidUntil/ValidUntil"

type ProfileProps = {
  session_token?: string
}

export default function Settings({ session_token }: ProfileProps) {
  //const { data, error, isLoading } = useSWR(GET_BINS_BY_USER(session_token), { fallbackData: { getBinsByUser: [] } })
  //const { getBinsByUser: bins = [] }: { getBinsByUser?: Bin[] } = data

  return <div className="flex flex-col gap-2">user</div>
}
