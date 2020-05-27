<template>
<p @click="openSelect(false)" v-if="actionType" :class="{ 'watched': actionType === 'watched', 'need_to_work': actionType === 'need_to_work', 'completed': actionType === 'completed'}">{{action[actionType]}}</p>
<p v-else></p>
</template>

<script>
export default {
    name: 'ActionType',
    props: ['actionType', 'openSelect'],
    data() {
        return {
            action: {
                watched: 'Просмотренный',
                need_to_work: 'В работу',
                completed: 'Проработанные'
            }
        }
    },
    methods: {}
}
</script>

<style>
.watched {
    border-radius: 5px;
    border: 1px solid blue;
    color: blue;
    padding: 3px;
    cursor: pointer
}

.need_to_work {
    border-radius: 5px;
    border: 1px solid brown;
    color: brown;
    padding: 3px;
    cursor: pointer
}

.completed {
    border-radius: 5px;
    border: 1px solid green;
    color: green;
    padding: 3px;
    cursor: pointer
}
</style>
