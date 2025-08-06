<template>
    <div class="design-table">
        <el-table style="width: 100%;" class="table-content">
            <el-table-column v-for="item in tableColumn" :key="item.value" :prop="item.value" :label="item.label"></el-table-column>
        </el-table>
    </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => []
    }
})


const tableColumn = computed(()=>{
    return props.data.list
})

</script>
<style lang="scss" scoped>
.design-table{
    width: 100%;
    .table-content{
        width: 100%;
    }
}
</style>