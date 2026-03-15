import { coActionDetailRepository } from "../repositories/coActionDetailRepository";

export function getCoActionDetail(id: string) {
  return coActionDetailRepository.findById(id);
}
