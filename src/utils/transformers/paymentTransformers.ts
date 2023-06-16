export function paymentSubjectTransform(subject: string | null | undefined) {
  return subject?.includes("/TXT") ? subject.split("/TXT/")[1] : subject;
}
