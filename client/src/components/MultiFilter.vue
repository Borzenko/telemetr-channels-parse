<template>
<div class='filter-wrap'>
    <span class='filter-title'>Фильтр:</span>
    <b-tabs content-class="mt-3" fill>
        <b-tab title="По категории" active>
            <b-form-select @change="filterChannels(selected_filter)" v-model="selected_filter" :options="options_category" size="sm" class="mt-3"></b-form-select>
        </b-tab>
        <b-tab title="По статусу">
            <b-form-select @change="filterChannels(selected_filter)" v-model="selected_filter" :options="options_status" size="sm" class="mt-3"></b-form-select>
        </b-tab>
        <b-tab title="По типу">
            <b-form-select @change="filterChannels(selected_filter)" v-model="selected_filter" :options="options_type" size="sm" class="mt-3"></b-form-select>
        </b-tab>
    </b-tabs>
</div>
</template>

<script>
export default {
    name: 'MultiFilter',
    props: ['filterChannels'],
    data() {
        return {
            selected_filter: null,
            options_category: [{
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
            ],
            options_status: [{
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
            }],
            options_type: [{
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
    }
}
</script>

<style>
.filter-wrap {
    display: flex;
    width: 50%;
    margin: 20px auto;
    align-items: center;
}

.filter-title {
    margin-right: 20px;
    font-weight: bold;
}
</style>
