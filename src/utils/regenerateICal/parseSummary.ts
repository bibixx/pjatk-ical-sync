import { parseExamSummary } from "./parseExamSummary"

export const parseSummary = (summary: string | undefined) => {
  if (!summary) {
    return {
      subject: undefined
    }
  }

  if (summary.includes('egzamin')) {
    return {
      subject: parseExamSummary(summary)
    }
  }


  const [subject, className] = summary.split('s.')

  if (!className) {
    return {
      subject: summary
    }
  }

  return {
    subject: subject.trim(),
    className: `s. ${className.trim()}`
  }
}
