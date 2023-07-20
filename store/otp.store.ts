import { create } from "zustand"
import { persist } from "zustand/middleware"
import { OtpAuthUrl } from "../models/otpAuthUrl.model"
import { SaltedOtp } from "../models/saltedOtp.model"

type E2eStore = {
  e2eKey: string

  actions: {
    addE2eKey: (e2eKey: string) => void
    clearState: () => void
  }
}

type OtpStore = {
  otps: OtpAuthUrl[]
  saltedOpts: SaltedOtp[]
  filter: string | undefined

  actions: {
    addOtps: (otps: OtpAuthUrl[], overwrite?: boolean) => void
    addSaltedOtps: (saltedOtps: SaltedOtp[], overwrite?: boolean) => void
    removeOtp: (index: number) => void
    updateFilter: (filterValue: string) => void
    clearState: () => void
  }
}

const useE2eStore = create<E2eStore>((set, getState) => ({
  e2eKey: "",

  actions: {
    addE2eKey: (e2eKey) => set({ e2eKey }),
    clearState: () => set({ e2eKey: "" }),
  },
}))

const useOtpStore = create<OtpStore, any>(
  persist(
    (set, get) => ({
      otps: [],
      saltedOpts: [],
      filter: undefined,

      actions: {
        addOtps: (otpsToAdd, overwrite = true) =>
          set((state) => ({ otps: overwrite ? (state.otps = otpsToAdd) : state.otps.concat(otpsToAdd) })),
        addSaltedOtps: (saltedOtps, overwrite = true) =>
          set((state) => ({
            saltedOpts: overwrite ? (state.saltedOpts = saltedOtps) : state.saltedOpts.concat(saltedOtps),
          })),
        removeOtp: (index) => set((state) => ({ otps: state.otps.filter((item, i) => i !== index) })),
        updateFilter: (filterValue) => set(() => ({ filter: filterValue })),
        clearState: () => set({ otps: [], filter: undefined }),
      },
    }),
    {
      name: "salted-otp-storage",
      partialize: (state) => ({ saltedOpts: state.saltedOpts }),
    }
  )
)

export const useOtpsStore = () => useOtpStore((state) => ({ otps: state.otps, saltedOtps: state.saltedOpts }))

export const useE2eKeyStore = () => useE2eStore((state) => ({ e2eKey: state.e2eKey }))

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

export const useE2eActions = () => useE2eStore((state) => state.actions)
