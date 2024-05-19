export type SystemDto = {
  id: number
  name: string
  url: string
  kcClient: string
  description?: string | null
  logoUrl: string | null
  requiredAgreements?: number[]
};