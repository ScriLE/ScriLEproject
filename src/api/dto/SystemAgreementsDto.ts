import {SystemDto} from "./SystemDto";
import {AgreementDto} from "./AgreementDto";

export type SystemAgreementsDto = {
  system: SystemDto,
  agreements: AgreementDto[]
}