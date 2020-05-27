<template>
<div class='filter-wrap'>
    <span class='filter-title'>Фильтр:</span>
    <div class="mr-3">
        <p class='filter-subtitle'>По категории</p>
        <b-form-select @change="changeFilter()" v-model="categories" :options="options_category" size="sm"></b-form-select>
    </div>
    <div class="mr-3">
        <p class='filter-subtitle'>По статусу</p>
        <b-form-select @change="changeFilter()" v-model="action_type" :options="options_status" size="sm"></b-form-select>
    </div>
    <div>
        <p class='filter-subtitle'>По типу</p>
        <b-form-select @change="changeFilter()" v-model="prev" :options="options_type" size="sm"></b-form-select>
    </div>
</div>
</template>

<script>
export default {
    name: 'MultiFilter',
    props: ['filterChannels'],
    data() {
        return {
            categories: null,
            action_type: null,
            prev: null,
            options_category: [{
                    value: {
                        $exists: true
                    },
                    text: 'Все'
                },
                {
                    value: 'Прогнозы и ставки',
                    text: 'Прогнозы и ставки'
                }, {
                    value: {
                        $size: 0
                    },
                    text: 'Без катеорий'
                }
            ],
            options_status: [{
                value: false,
                text: 'Все'
            }, {
                value: {
                    $exists: false
                },
                text: 'Не отмечен'
            }, {
                value: 'watched',
                text: 'Просмотренный'
            }, {
                value: 'need_to_work',
                text: 'В работу'
            }, {
                value: 'completed',
                text: 'Проработанные'
            }],
            options_type: [{
                    value: {
                        $exists: true
                    },
                    text: 'Измененный'
                },
                {
                    value: {
                        $exists: false
                    },
                    text: 'Новый'
                },
            ]
        }
    },
    methods: {
        changeFilter() {
            let data = {}
            if (this.categories) {
                data.categories = this.categories
            }
            if (this.action_type) {
                data.action_type = this.action_type
            }
            if (this.prev) {
                data.prev = this.prev
            }

            console.log(data)
            this.filterChannels(data)
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

.filter-subtitle{
    font-size: 12px;
    margin: 5px 0;
}
</style>
