import { gql } from "@apollo/client";

export const GET_PEMBERIAN_LAMPUNG = gql`
  query GetPemberianLampung($input: ModelPemberianInput!) {
    getPemberianLampung(input: $input) {
      namaSekolah
      nisn
      nik
      nominal
      nomorSK
      nama
      bank
      rekening
      rombel
      fase
      layakPIP
    }
  }
`;
