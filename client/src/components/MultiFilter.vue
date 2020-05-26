<template>
<b-form-select @change="filterChannels(selected_filter)" v-model="selected_filter" :options="options" size="sm" class="mt-3"></b-form-select>
</template>

<script>
export default {
    name: 'MultiFilter',
    props: ['filterChannels'],
    data() {
        return {
            selected_filter: null,
            options: [{
                    label: 'По категориям',
                    options: [{
                            value: {},
                            text: 'Все'
                        },
                        {
                            value: {
                                categories: 'Прогнозы и ставки'
                            },
                            text: 'Прогнозы и ставки'
                        }, {
                            value: {
                                categories: {
                                    $size: 0
                                }
                            },
                            text: 'Без катеорий'
                        }
                    ]
                },
                {
                    label: 'По статусу',
                    options: [{
                        value: {},
                        text: 'Все'
                    }, {
                        value: {
                            action_type: null
                        },
                        text: 'Не отмечен'
                    }, {
                        value: {
                            action_type: 'watched'
                        },
                        text: 'Просмотренный'
                    }, {
                        value: {
                            action_type: 'need_to_work'
                        },
                        text: 'Просмотренный, взять в работу'
                    }, {
                        value: {
                            action_type: 'completed'
                        },
                        text: 'Проработанные'
                    }]
                }, {
                    label: 'По типу',
                    options: [{
                            value: {
                                prev: {
                                    $exists: true
                                }
                            },
                            text: 'Измененный'
                        },
                        {
                            value: {
                                prev: {
                                    $exists: false
                                }
                            },
                            text: 'Новый'
                        },
                    ]
                }
            ]
        }
    }
}
//{ prev: { $exists: true } }
</script>
