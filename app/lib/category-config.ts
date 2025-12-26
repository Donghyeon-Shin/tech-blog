export const categoryColors = {
  Algorithm: {
    label: 'Algorithm',
    chartColor: 'oklch(73.57% 0.158 251.78)',
    bgColor: '#1E293B',
    textColor: '#60A5FA',
  },
  React: {
    label: 'React',
    chartColor: 'oklch(76.22% 0.15 237.05)',
    bgColor: '#0F172A',
    textColor: '#38BDF8',
  },
  Book: {
    label: 'Book',
    chartColor: 'oklch(73.91% 0.198 71.04)',
    bgColor: '#2A1F1D',
    textColor: '#F59E0B',
  },
  LangChain: {
    label: 'LangChain',
    chartColor: 'oklch(77.56% 0.169 189.69)',
    bgColor: '#052E2B',
    textColor: '#2DD4BF',
  },
  Research: {
    label: 'Research',
    chartColor: 'oklch(67.54% 0.183 279.77)',
    bgColor: '#1C1917',
    textColor: '#A78BFA',
  },
  SQL: {
    label: 'SQL',
    chartColor: 'oklch(77.2% 0.182 161.46)',
    bgColor: '#1F2937',
    textColor: '#34D399',
  },
  Project: {
    label: 'Project',
    chartColor: 'oklch(68.17% 0.208 4.74)',
    bgColor: '#18181B',
    textColor: '#F472B6',
  },
} as const;

export type CategoryName = keyof typeof categoryColors | 'null';
