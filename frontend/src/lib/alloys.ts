export interface Alloy {
  id: string;
  name: string;
  uns: string;
  swatch: string;
  hipTemp: string;
  hipPressure: string;
  hipHold: string;
  hipCooling: string;
  weldClass: string;
  toleranceClass: string;
  pickling: string;
  ferrite: string | null;
  shrinkage: string;
  shrinkageNote: string;
  codes: string[];
  postHipMass: string;
  isDefault?: boolean;
}

export const ALLOYS: Alloy[] = [
  {
    id: 'duplex_2507',
    name: 'Duplex 2507',
    uns: 'S32750',
    swatch: '#a3b8c4',
    hipTemp: '1140 °C ± 10',
    hipPressure: '118 MPa',
    hipHold: '4 h',
    hipCooling: 'rapid gas-quench >200 °C/min through 1040–650 °C',
    weldClass: 'ISO 5817 class B',
    toleranceClass: 'ISO 13920 class AF',
    pickling: 'HNO₃ 10% / HF 2% (no HCl — selective corrosion risk)',
    ferrite: '35–55% per ASTM E562',
    shrinkage: '12–14% linear anisotropic',
    shrinkageNote: 'MTC private formula plugs in (Phase 2)',
    codes: ['NORSOK M-650', 'NORSOK M-630', 'API 6A', 'NACE MR0175'],
    postHipMass: '37.8 kg',
    isDefault: true,
  },
  {
    id: 'saf_2906',
    name: 'Super-duplex SAF 2906',
    uns: 'S39274',
    swatch: '#b0bec5',
    hipTemp: '1140 °C ± 10',
    hipPressure: '118 MPa',
    hipHold: '4 h',
    hipCooling: 'rapid gas-quench >250 °C/min',
    weldClass: 'ISO 5817 class B',
    toleranceClass: 'ISO 13920 class AF',
    pickling: 'HNO₃ 10% / HF 2%',
    ferrite: '35–55% per ASTM E562',
    shrinkage: '12–14% linear anisotropic',
    shrinkageNote: 'Sandvik-spec · North Sea Vetco primary',
    codes: ['NORSOK M-650', 'NORSOK M-630', 'API 17D', 'NACE MR0175 Cl⁻ severe'],
    postHipMass: '38.2 kg',
  },
  {
    id: 'inconel_625',
    name: 'Inconel 625',
    uns: 'N06625',
    swatch: '#c8b59a',
    hipTemp: '1175 °C ± 10',
    hipPressure: '118 MPa',
    hipHold: '4 h',
    hipCooling: 'gas-quench',
    weldClass: 'ISO 5817 class B',
    toleranceClass: 'ISO 13920 class AF',
    pickling: 'HNO₃ / HF per AMS 2700',
    ferrite: null,
    shrinkage: '13–15% linear',
    shrinkageNote: 'per Cai 2017 / Sobhani 2023',
    codes: ['ASME B&PV Sec II', 'ASTM B443', 'NACE MR0175'],
    postHipMass: '40.1 kg',
  },
  {
    id: 'incoloy_825',
    name: 'Incoloy 825',
    uns: 'N08825',
    swatch: '#bdbdbd',
    hipTemp: '1150 °C ± 10',
    hipPressure: '103 MPa',
    hipHold: '4 h',
    hipCooling: 'stabilize anneal 930 °C / WQ',
    weldClass: 'ISO 5817 class B',
    toleranceClass: 'ISO 13920 class AF',
    pickling: 'HNO₃ / HF',
    ferrite: null,
    shrinkage: '12–14% linear',
    shrinkageNote: 'chemical / marine accounts',
    codes: ['ASME B&PV Sec II', 'ASTM B564', 'NACE MR0175'],
    postHipMass: '39.4 kg',
  },
  {
    id: 'ss_316l',
    name: '316L',
    uns: 'S31603',
    swatch: '#90caf9',
    hipTemp: '1150 °C ± 15',
    hipPressure: '103 MPa',
    hipHold: '3 h',
    hipCooling: 'gas-cool',
    weldClass: 'ISO 5817 class B',
    toleranceClass: 'ISO 13920 class AF',
    pickling: 'HNO₃ 15% / HF 3%',
    ferrite: null,
    shrinkage: '12–14% linear',
    shrinkageNote: 'per ASTM A988 baseline',
    codes: ['ASTM A988', 'ASME B&PV', 'ISO 9001'],
    postHipMass: '37.2 kg',
  },
  {
    id: 'inconel_718',
    name: 'Inconel 718',
    uns: 'N07718',
    swatch: '#d4a896',
    hipTemp: '1175 °C ± 10',
    hipPressure: '150 MPa',
    hipHold: '4 h',
    hipCooling: '2-stage age: 720 °C/8 h + 620 °C/8 h',
    weldClass: 'ISO 5817 class B',
    toleranceClass: 'ISO 13920 class AF',
    pickling: 'HNO₃ / HF per AMS 2700',
    ferrite: null,
    shrinkage: '13–15% linear',
    shrinkageNote: 'aerospace / power gen grade',
    codes: ['AMS 5662', 'ASTM B637', 'NORSOK M-650'],
    postHipMass: '41.8 kg',
  },
  {
    id: 'ti_6al_4v',
    name: 'Ti-6Al-4V',
    uns: 'R56400',
    swatch: '#b0b8c8',
    hipTemp: '920 °C ± 10',
    hipPressure: '103 MPa',
    hipHold: '2 h',
    hipCooling: 'furnace-cool',
    weldClass: 'ISO 5817 class B',
    toleranceClass: 'ISO 13920 class AF',
    pickling: 'HNO₃ / HF (titanium-safe)',
    ferrite: null,
    shrinkage: '10–12% linear',
    shrinkageNote: 'per Van Nguyen 2020',
    codes: ['AMS 4928', 'ASTM B265', 'NADCAP'],
    postHipMass: '22.6 kg',
  },
];

export function getAlloyById(id: string): Alloy {
  return ALLOYS.find(a => a.id === id) ?? ALLOYS[0];
}
