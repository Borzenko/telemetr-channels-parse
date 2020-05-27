<template>
<div>
    <ActionType v-if="hideSelect" :openSelect="openSelect" :actionType='actionType'></ActionType>
    <b-form-select v-if="!hideSelect" @change="onChange()" v-model="selected_action_type" :options="action_type" size="sm"></b-form-select>
    <b-button @click="openSelect(false)" v-if="hideSelect&&!actionType" variant="light">Добавить статус</b-button>
</div>
</template>

<script>
import axios from 'axios'
import ActionType from './ActionType.vue'

const baseUrl = process.env.VUE_APP_BACKEND_URL || 'http://localhost:3000'

export default {
    name: 'SelectActionType',
    props: ['id', 'actionType', 'fetch', 'prevActionType'],
    components: {
        ActionType
    },
    data() {
        return {
            selected_action_type: this.actionType || null,
            action_type: [{
                    value: null,
                    text: 'Не отмечен'
                },
                {
                    value: 'watched',
                    text: 'Просмотренный'
                },
                {
                    value: 'need_to_work',
                    text: 'В работу'
                },
                {
                    value: 'completed',
                    text: 'Проработанные ',
                }
            ],
            hideSelect: true
        }
    },
    methods: {
        async onChange() {
            await axios.put(`${baseUrl}/api/channels/actionType`, {
                id: this.id,
                action_type: this.selected_action_type
            })
            this.hideSelect = true
            this.fetch()
        },
        openSelect(value) {
            this.hideSelect = value
        }
    }
}
</script>
