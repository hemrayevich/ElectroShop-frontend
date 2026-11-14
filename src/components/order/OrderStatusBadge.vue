<script setup>
import BaseBadge from '@/components/ui/BaseBadge.vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const statusConfig = {
  pending: {
    label: 'Ожидает',
    variant: 'warning',
  },
  paid: {
    label: 'Оплачен',
    variant: 'primary',
  },
  shipped: {
    label: 'Отправлен',
    variant: 'info',
  },
  delivered: {
    label: 'Доставлен',
    variant: 'success',
  },
  cancelled: {
    label: 'Отменён',
    variant: 'danger',
  },
}
</script>

<template>
  <BaseBadge
    :variant="statusConfig[props.status]?.variant || 'neutral'"
    size="md"
  >
    {{ statusConfig[props.status]?.label || props.status }}
  </BaseBadge>
</template>
