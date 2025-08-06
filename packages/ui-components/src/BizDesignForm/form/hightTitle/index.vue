<template>
    <div>{{label}}</div>
</template>
<script lang="js">
defineOptions({
    name: 'HightTitle'
})
defineProps({
    label: {
        type: String,
        default: () => "标题"
    }
})
</script>