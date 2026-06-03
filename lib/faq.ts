import type { FaqItem } from '@/lib/types'

const defaultFaq: FaqItem[] = [
  {
    question: '구매 후 전자책은 어떻게 받나요?',
    answer:
      '결제가 완료되면 Lemon Squeezy에서 등록한 이메일로 다운로드 안내가 발송됩니다. 스팸함도 확인해 주세요.',
  },
  {
    question: '환불이 가능한가요?',
    answer:
      '디지털 상품 특성상 결제 완료 후 환불이 제한될 수 있습니다. 문제가 있으면 구매 시 사용한 이메일로 문의해 주세요.',
  },
  {
    question: '어떤 파일 형식으로 제공되나요?',
    answer:
      '상품마다 PDF, EPUB 등 형식이 다를 수 있습니다. 상세 설명을 확인하거나 결제 전 FAQ를 참고해 주세요.',
  },
]

const faqBySlug: Record<string, FaqItem[]> = {}

export function getFaqForProduct(slug: string): FaqItem[] {
  return faqBySlug[slug] ?? defaultFaq
}
