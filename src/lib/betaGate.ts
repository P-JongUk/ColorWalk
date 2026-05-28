export const BETA_GATE_KEY = 'colorwalk:beta-invite-ok'
export const BETA_INVITE_VALUE_KEY = 'colorwalk:beta-invite-code'

export function getInviteCode() {
  return (import.meta.env.VITE_BETA_INVITE_CODE as string | undefined)?.trim()
}

export function isBetaGateEnabled() {
  return Boolean(getInviteCode())
}

export function hasBetaAccess() {
  if (!isBetaGateEnabled()) return true
  return localStorage.getItem(BETA_GATE_KEY) === 'true'
}

export function getStoredInviteCode() {
  return localStorage.getItem(BETA_INVITE_VALUE_KEY) ?? ''
}
