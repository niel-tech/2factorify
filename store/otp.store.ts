import { create } from "zustand"
import { OtpAuthUrl } from "../models/otpAuthUrl.model"

type OtpStore = {
  otps: OtpAuthUrl[]
  filter: string | undefined

  actions: {
    addOtps: (otps: OtpAuthUrl[]) => void
    removeOtp: (index: number) => void
    updateFilter: (filterValue: string) => void
  }
}

const useOtpStore = create<OtpStore>((set, getState) => ({
  otps: [],
  filter: undefined,

  actions: {
    addOtps: (otpsToAdd) => set((state) => ({ otps: state.otps.concat(otpsToAdd) })),
    removeOtp: (index) => set((state) => ({ otps: state.otps.filter((item, i) => i !== index) })),
    updateFilter: (filterValue) => set(() => ({ filter: filterValue })),
  },
}))

export const useOtps = () => useOtpStore((state) => state.otps)

export const useFilteredOtps = () =>
  useOtpStore((state) =>
    state.otps.filter((otp) =>
      !state?.filter
        ? state.otps
        : state.filter
            .split(" ")
            .every(
              (filter) =>
                otp.issuer.toLowerCase().includes(filter?.toLowerCase() ?? "") ||
                otp.account.toLowerCase().includes(filter?.toLowerCase() ?? "")
            )
    )
  )

export const useOtpActions = () => useOtpStore((state) => state.actions)
