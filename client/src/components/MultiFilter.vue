<template>
<div class='filter-wrap'>
    <b-form-group>
        <b-form-checkbox-group class="text-center" v-model="selected" :options="options" name="buttons-1" buttons size="sm"></b-form-checkbox-group>
    </b-form-group>
    <b-button  @click="filterChannels(selected)" variant="success">Фильтровать</b-button>
    <b-button>Сброс фильтра</b-button>
</div>
</template>

<script>
export default {
    name: 'MultiFilter',
    props: ['options', 'filterChannels'],
    data() {
        return {
            selected: []
        }
    }
}
</script>

<style>
.filter-wrap {
    width: 80%;
    overflow: scroll;
    margin: 0 auto;
    border-radius: 5px;
}
.filter-wrap label{
    display: flex;
    align-items: center;
    width: max-content;
    min-width: 40px;
}
</style>
