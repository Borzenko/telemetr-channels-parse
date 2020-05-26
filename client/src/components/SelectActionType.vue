<template>

<b-form-select @change="onChange()" v-model="selected_action_type" :options="action_type" size="sm" class="mt-3"></b-form-select>
</template>
<script>

import axios from 'axios'

const baseUrl = 'http://localhost:3000'

export default {
    name: 'SelectActionType',
    props: ['id','actionType','fetch', 'prevActionType'],
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
                    text: 'Просмотренный, взять в работу'
                },
                {
                    value: 'completed',
                    text: 'Проработанные ',
                }
            ]
        }
    },
    methods: {
        async onChange(){
            await axios.put(`${baseUrl}/api/channels/actionType`, {
                id: this.id,
                action_type: this.selected_action_type
            })
            this.fetch()
        }
    }
}
</script>